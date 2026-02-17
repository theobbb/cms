// src/routes/[app]/auth/+server.ts
import { dev } from '$app/environment';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { server } from '@passwordless-id/webauthn';
import { json, error } from '@sveltejs/kit';

export async function GET({ params, cookies, locals: { app }, url }) {
	const register = url.searchParams.get('register');
	const challenge = server.randomChallenge();
	const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);

	// Extract subdomain as RP ID
	// agraf.localhost → 'agraf.localhost'
	// agraf.mydomain.com → 'agraf.mydomain.com'
	const rpId = url.hostname;

	const cookie_options = {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60 * 60
	} as const;

	// Registration flow
	if (register) {
		const user = await super_pocketbase.collection('users').getOne(register);
		cookies.set('registration_challenge', challenge, cookie_options);

		const options: PublicKeyCredentialCreationOptionsJSON = {
			challenge: challenge,
			rp: {
				name: app.title,
				id: rpId
			},
			user: {
				id: user.id,
				name: user.email || user.namme,
				displayName: user.email || user.name
			},
			pubKeyCredParams: [
				{ type: 'public-key', alg: -7 }, // ES256
				{ type: 'public-key', alg: -257 } // RS256
			],
			timeout: 60000,
			attestation: 'none',
			authenticatorSelection: {
				residentKey: 'preferred',
				userVerification: 'required'
			}
		};
		return json(options);
	}

	cookies.set('authentication_challenge', challenge, cookie_options);
	const options: PublicKeyCredentialRequestOptionsJSON = {
		challenge,
		timeout: 60000,
		userVerification: 'required',
		rpId: rpId
	};
	return json(options);
}

export async function POST({ params, request, cookies, locals: { pocketbase, app }, url }) {
	const register = url.searchParams.get('register');
	const { credential } = await request.json();
	const expected_challenge = cookies.get(
		register ? 'registration_challenge' : 'authentication_challenge'
	);

	if (!expected_challenge) {
		throw error(400, 'Session expired');
	}

	const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);
	let user_id: string;

	// Registration flow
	if (register) {
		try {
			const verified = await server.verifyRegistration(credential, {
				challenge: expected_challenge,
				origin: url.origin
			});

			cookies.delete('registration_challenge', { path: '/' });

			// Create the passkey
			await super_pocketbase.collection('passkeys').create({
				user: register,
				credential_id: verified.credential.id,
				public_key: verified.credential.publicKey,
				algorithm: verified.credential.algorithm
			});
			user_id = register;
		} catch (err) {
			console.error('Registration failed:', err);
			throw error(400, 'Registration verification failed');
		}
	} else {
		// Authentication flow
		try {
			const storedPasskey = await super_pocketbase
				.collection('passkeys')
				.getFirstListItem(`credential_id = "${credential.id}"`);

			const verified = await server.verifyAuthentication(
				credential,
				{
					id: storedPasskey.credential_id,
					publicKey: storedPasskey.public_key,
					algorithm: storedPasskey.algorithm,
					transports: storedPasskey.transports
				},
				{
					challenge: expected_challenge,
					origin: url.origin,
					userVerified: true
				}
			);
			if (!verified) {
				throw error(400, 'Invalid signature or challenge');
			}
			cookies.delete('authentication_challenge', { path: '/' });
			user_id = storedPasskey.user;
		} catch (e) {
			console.error('Authentication verification failed:', e);
			throw error(400, 'Invalid signature or challenge');
		}
	}

	// Log the user in
	const tempPassword = crypto.randomUUID().replace(/-/g, '');

	const user = await super_pocketbase.collection('users').update(user_id, {
		password: tempPassword,
		passwordConfirm: tempPassword,
		verified: true
	});

	await pocketbase.collection('users').authWithPassword(user.email, tempPassword);
	return json({ success: true });

	//throw redirect(303, '/' + params.app);
}
