import { dev } from '$app/environment';
import { PASSKEY_AUTH_SECRET } from '$env/static/private';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { server } from '@passwordless-id/webauthn';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export async function load({ url, cookies, locals: { app } }) {
	const register_id = url.searchParams.get('register');

	// --- 1. Passkey Challenge Logic ---
	const challenge = server.randomChallenge();
	const rpId = url.hostname;

	const cookie_options = {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60 * 60
	} as const;

	let options;

	// Registration Flow
	if (register_id) {
		const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);

		// Note: We use try/catch here in case the user ID is invalid
		try {
			const register_user = await super_pocketbase.collection('_user_invites').getOne(register_id);
			//if (register_user.verified) throw new Error('User already registered');

			cookies.set('registration_challenge', challenge, cookie_options);

			options = {
				challenge,
				rp: { name: app.title, id: rpId },
				user: {
					id: register_user.id,
					name: register_user.name,
					displayName: register_user.name
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
			} satisfies PublicKeyCredentialCreationOptionsJSON;

			return { register: register_user, options };
		} catch (e) {
			// Handle invalid user ID or verified user
			return { register: null, options: null, error: 'Invalid registration link' };
		}
	}

	// Authentication Flow
	cookies.set('authentication_challenge', challenge, cookie_options);

	options = {
		challenge,
		timeout: 60000,
		userVerification: 'required',
		rpId
	} satisfies PublicKeyCredentialRequestOptionsJSON;

	return { register: null, options };
}

export const actions: Actions = {
	default: async ({ request, cookies, locals: { pocketbase, app }, url }) => {
		const isRegistration = url.searchParams.has('register');
		const formData = await request.formData();
		const credentialJSON = formData.get('credential') as string;

		if (!credentialJSON) {
			return fail(400, { message: 'Missing credentials' });
		}

		// Parse the JSON.toJSON() output from the client
		const credential = JSON.parse(credentialJSON);
		const challengeKey = isRegistration ? 'registration_challenge' : 'authentication_challenge';
		const challenge = cookies.get(challengeKey);

		if (!challenge) {
			return fail(400, { message: 'Session expired. Please refresh the page.' });
		}

		const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);
		let userId: string;

		try {
			if (isRegistration) {
				const invite_id = url.searchParams.get('register')!;
				const user_invite = await super_pocketbase.collection('_user_invites').getOne(invite_id);

				const verified = await server.verifyRegistration(credential, {
					challenge,
					origin: url.origin
				});

				await super_pocketbase.collection('_user_invites').delete(invite_id);

				const user = await super_pocketbase.collection('users').create({
					name: user_invite.name,
					password: PASSKEY_AUTH_SECRET,
					passwordConfirm: PASSKEY_AUTH_SECRET,
					verified: true
				});

				await super_pocketbase.collection('_passkeys').create({
					user: user.id,
					credential_id: verified.credential.id,
					public_key: verified.credential.publicKey,
					algorithm: verified.credential.algorithm,
					transports: verified.credential.transports || [] // Save transports if available
				});

				userId = user.id;
			} else {
				// Search for passkey by credential ID
				const storedPasskey = await super_pocketbase
					.collection('_passkeys')
					.getFirstListItem(`credential_id = "${credential.id}"`)
					.catch(() => {
						throw new Error('Passkey not found');
					});

				const verified = await server.verifyAuthentication(
					credential,
					{
						id: storedPasskey.credential_id,
						publicKey: storedPasskey.public_key,
						algorithm: storedPasskey.algorithm,
						transports: storedPasskey.transports
					},
					{
						challenge,
						origin: url.origin,
						userVerified: true
					}
				);

				userId = storedPasskey.user;
			}

			cookies.delete(challengeKey, { path: '/' });

			const user = await super_pocketbase.collection('users').getOne(userId);
			await pocketbase.collection('users').authWithPassword(user.name, PASSKEY_AUTH_SECRET);

			throw redirect(303, '/');
		} catch (err: any) {
			console.error('Auth Error:', err);
			// Do not leak internal server errors, but give hints
			const msg = err.status === 303 ? 'Redirecting' : err.message || 'Authentication failed';
			if (err.status === 303) throw err;
			return fail(400, { message: msg });
		}
	}
};
