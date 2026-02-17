// src/routes/[app]/auth/login/request/+server.ts
import { dev } from '$app/environment';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { server } from '@passwordless-id/webauthn';
import { json, error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function GET({ params, cookies, locals: { app }, url }) {
	const register = url.searchParams.get('register');

	// const { name_or_email } = await request.json();

	const challenge = server.randomChallenge();

	const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);

	// const user = await super_pocketbase
	// 	.collection('users')
	// 	.getFirstListItem(`name = "${name_or_email}" || email = "${name_or_email}"`);

	const cookie_options = {
		path: '/' + params.app,
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60 * 5
	} as const;

	if (register) {
		const user = await super_pocketbase.collection('users').getOne(register);
		console.log(user);
		cookies.set('registration_challenge', challenge, cookie_options);
		return json({
			options: {
				challenge: challenge,
				rp: {
					name: app.title,
					id: url.hostname
				},
				user: {
					id: user.id, // Already a string, no need for base64
					name: user.name || user.email,
					displayName: user.name || user.email
				},
				pubKeyCredParams: [
					{ type: 'public-key', alg: -7 }, // ES256
					{ type: 'public-key', alg: -257 } // RS256
				],
				timeout: 60000,
				attestation: 'none',
				authenticatorSelection: {
					residentKey: 'preferred',
					userVerification: 'preferred'
				}
			},
			userId: user.id
		});
	}

	// const passkeys = await super_pocketbase.collection('passkeys').getFullList({
	// 	filter: `user = "${user.id}"`
	// });

	// if (passkeys.length === 0) throw error(400, 'No passkeys registered for this user');

	// 3. Store challenge in a secure cookie
	cookies.set('authentication_challenge', challenge, cookie_options);
	return json({
		options: {
			challenge,
			timeout: 60000,
			userVerification: 'preferred',
			rpId: url.hostname
		}
	});
}

export async function POST({ params, request, cookies, locals: { pocketbase, app }, url }) {
	const register = url.searchParams.get('register');

	const { credential } = await request.json();
	const expected_challenge = cookies.get(
		register ? 'registration_challenge' : 'authentication_challenge'
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

		cookies.delete('authentication_challenge', { path: '/' + params.app });

		const tempPassword = crypto.randomUUID().replace('-', '');

		const user = await super_pocketbase.collection('users').update(storedPasskey.user, {
			password: tempPassword,
			passwordConfirm: tempPassword,
			verified: true
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
