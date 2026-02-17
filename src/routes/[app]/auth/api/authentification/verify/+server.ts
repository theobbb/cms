import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { server } from '@passwordless-id/webauthn';
import { redirect } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';

export async function POST({ params, request, cookies, locals: { pocketbase, app }, url }) {
	const register = url.searchParams.get('invite');

	const { credential } = await request.json();
	const expected_challenge = cookies.get(
		register ? 'registration_challenge' : 'authentification_challenge'
	);

	if (!expected_challenge) throw error(400, 'Session expired');

	if (register) {
		try {
			const verified = await server.verifyRegistration(credential, {
				challenge: expected_challenge,
				origin: url.origin
			});

			cookies.delete('registration_challenge', { path: '/' + params.app });

			await pocketbase.collection('passkeys').create({
				user: register,
				credential_id: verified.credential.id,
				public_key: verified.credential.publicKey,
				algorithm: verified.credential.algorithm
			});
		} catch (err) {
			console.error(err);
			throw error(400, 'Verification failed');
		}
	}

	const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);

	const storedPasskey = await super_pocketbase
		.collection('passkeys')
		.getFirstListItem(`credential_id = "${credential.id}"`);

	const credential_key = {
		id: storedPasskey.credential_id,
		publicKey: storedPasskey.public_key,
		algorithm: storedPasskey.algorithm,
		transports: storedPasskey.transports
	};
	const expected = {
		challenge: expected_challenge,
		origin: url.origin,
		userVerified: true // should be set if `userVerification` was set to `required` in the authentication options (default)
	};

	try {
		const verified = await server.verifyAuthentication(credential, credential_key, expected);

		if (!verified) throw error(400, 'Invalid signature or challenge');

		cookies.delete('authentification_challenge', { path: '/' + params.app });

		const tempPassword = crypto.randomUUID().replace('-', '');

		const user = await super_pocketbase.collection('users').update(storedPasskey.user, {
			password: tempPassword,
			passwordConfirm: tempPassword
		});

		await pocketbase.collection('users').authWithPassword(user.email, tempPassword);

		// pocketbase.authStore.save(authData.token, authData.record);

		// const authCookie = pocketbase.authStore.exportToCookie({
		// 	path: '/' + params.app,
		// 	httpOnly: true,
		// 	secure: !dev,
		// 	sameSite: 'Lax'
		// });

		// return new Response(JSON.stringify({ success: true }), {
		// 	headers: {
		// 		'set-cookie': authCookie,
		// 		'content-type': 'application/json'
		// 	}
		// });
	} catch (e) {
		console.error('Auth verification failed:', e);
		throw error(400, 'Invalid signature or challenge');
	}

	throw redirect(303, '/' + params.app);
}
