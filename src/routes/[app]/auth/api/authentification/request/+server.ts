// src/routes/[app]/auth/login/request/+server.ts
import { dev } from '$app/environment';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { server } from '@passwordless-id/webauthn';
import { json, error } from '@sveltejs/kit';

export async function POST({ request, params, cookies, locals: { app }, url }) {
	const invite = url.searchParams.get('invite');

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

	if (invite) {
		const user = await super_pocketbase.collection('users').getOne(invite);
		cookies.set('registration_challenge', challenge, cookie_options);
		return json({
			options: {
				challenge: challenge,
				rp: {
					name: 'Your App',
					id: 'localhost'
				},
				user: {
					id: user.id, // Already a string, no need for base64
					name: user.username || user.email,
					displayName: user.name || user.username
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
	cookies.set('authentification_challenge', challenge, cookie_options);
	return json({
		options: {
			challenge,
			timeout: 60000,
			userVerification: 'preferred',
			rpId: 'localhost' // Must match the registration ID
			// allowCredentials: passkeys.map((pk) => ({
			// 	id: pk.credential_id,
			// 	type: 'public-key',
			// 	transports: ['internal', 'usb', 'ble', 'nfc']
			// }))
		}
	});
	// return json({
	// 	options: {
	// 		challenge,
	// 		timeout: 60000,
	// 		userVerification: 'preferred',
	// 		rpId: 'localhost', // Must match the registration ID
	// 		allowCredentials: passkeys.map((pk) => ({
	// 			id: pk.credential_id,
	// 			type: 'public-key',
	// 			transports: ['internal', 'usb', 'ble', 'nfc']
	// 		}))
	// 	}
	// });
}
