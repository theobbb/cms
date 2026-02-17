// src/routes/[app]/auth/+server.ts
import { dev } from '$app/environment';
import { PASSKEY_AUTH_SECRET } from '$env/static/private';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { server } from '@passwordless-id/webauthn';
import { json, error } from '@sveltejs/kit';

export async function GET({ cookies, locals: { app }, url }) {
	const register = url.searchParams.get('register');
	const challenge = server.randomChallenge();
	const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);
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

		return json({
			challenge,
			rp: {
				name: app.title,
				id: rpId
			},
			user: {
				id: user.id,
				name: user.email || user.name,
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
		});
	}

	// Authentication flow
	cookies.set('authentication_challenge', challenge, cookie_options);

	return json({
		challenge,
		timeout: 60000,
		userVerification: 'required',
		rpId
	});
}

// export async function POST({ request, cookies, locals: { pocketbase, app }, url }) {
// 	const register = url.searchParams.get('register');
// 	const { credential } = await request.json();

// 	const expected_challenge = cookies.get(
// 		register ? 'registration_challenge' : 'authentication_challenge'
// 	);

// 	if (!expected_challenge) {
// 		throw error(400, 'Session expired');
// 	}

// 	const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);
// 	let user_id: string;

// 	// Registration flow
// 	if (register) {
// 		try {
// 			const verified = await server.verifyRegistration(credential, {
// 				challenge: expected_challenge,
// 				origin: url.origin
// 			});

// 			cookies.delete('registration_challenge', { path: '/' });

// 			// Set fixed password for passkey-based auth
// 			await super_pocketbase.collection('users').update(register, {
// 				password: PASSKEY_AUTH_SECRET,
// 				passwordConfirm: PASSKEY_AUTH_SECRET,
// 				verified: true
// 			});

// 			// Create the passkey
// 			await super_pocketbase.collection('passkeys').create({
// 				user: register,
// 				credential_id: verified.credential.id,
// 				public_key: verified.credential.publicKey,
// 				algorithm: verified.credential.algorithm
// 			});

// 			user_id = register;
// 		} catch (err) {
// 			console.error('Registration failed:', err);
// 			throw error(400, 'Registration verification failed');
// 		}
// 	} else {
// 		// Authentication flow
// 		try {
// 			const storedPasskey = await super_pocketbase
// 				.collection('passkeys')
// 				.getFirstListItem(`credential_id = "${credential.id}"`);

// 			const verified = await server.verifyAuthentication(
// 				credential,
// 				{
// 					id: storedPasskey.credential_id,
// 					publicKey: storedPasskey.public_key,
// 					algorithm: storedPasskey.algorithm,
// 					transports: storedPasskey.transports
// 				},
// 				{
// 					challenge: expected_challenge,
// 					origin: url.origin,
// 					userVerified: true
// 				}
// 			);

// 			if (!verified) {
// 				throw error(400, 'Invalid signature or challenge');
// 			}

// 			cookies.delete('authentication_challenge', { path: '/' });
// 			user_id = storedPasskey.user;
// 		} catch (e) {
// 			console.error('Authentication verification failed:', e);
// 			throw error(400, 'Invalid signature or challenge');
// 		}
// 	}

// 	// Authenticate user with PocketBase
// 	const user = await super_pocketbase.collection('users').getOne(user_id);
// 	await pocketbase.collection('users').authWithPassword(user.email, PASSKEY_AUTH_SECRET);

// 	return json({ success: true });
// }
