import { dev } from '$app/environment';
import { PASSKEY_AUTH_SECRET } from '$env/static/private';
import { server } from '@passwordless-id/webauthn';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'strict',
	secure: !dev,
	maxAge: 60 * 60
} as const;

export async function load({ url, cookies, locals: { app, super_pocketbase } }) {
	const register_id = url.searchParams.get('register');
	const pair_id = url.searchParams.get('pair');

	const challenge = server.randomChallenge();
	const rpId = url.hostname;

	// Registration Flow
	if (register_id) {
		try {
			const register_user = await super_pocketbase.collection('users').getOne(register_id);

			cookies.set('registration_challenge', challenge, COOKIE_OPTIONS);

			const options = get_registration_options(challenge, rpId, app.title, register_user);

			return { register: register_user, pair: null, options };
		} catch (e) {
			// Handle invalid user ID or verified user
			return { register: null, options: null, error: 'Invalid registration link' };
		}
	}

	// Device Connect Flow
	if (pair_id) {
		try {
			const device_invite = await super_pocketbase
				.collection('_passkey_invites')
				.getOne(pair_id, { expand: 'user' });

			const existing_user = await super_pocketbase.collection('users').getOne(device_invite.user);

			cookies.set('registration_challenge', challenge, COOKIE_OPTIONS);
			const options = get_registration_options(challenge, rpId, app.title, existing_user);

			return { register: null, pair: device_invite, options };
		} catch (e) {
			return {
				register: null,
				pair: null,
				options: null,
				error: 'Invalid pairing link'
			};
		}
	}

	// Authentication Flow
	cookies.set('authentication_challenge', challenge, COOKIE_OPTIONS);

	return {
		register: null,
		pair: null,
		options: {
			challenge,
			timeout: 60000,
			userVerification: 'required',
			rpId
		} satisfies PublicKeyCredentialRequestOptionsJSON
	};
}

export const actions: Actions = {
	default: async ({ request, cookies, locals: { pocketbase, super_pocketbase, app }, url }) => {
		const isRegistration = url.searchParams.has('register');
		const isPairing = url.searchParams.has('pair');

		const formData = await request.formData();
		const credentialJSON = formData.get('credential') as string;
		if (!credentialJSON) return fail(400, { message: 'Missing credentials' });

		const credential = JSON.parse(credentialJSON);
		const challengeKey =
			isRegistration || isPairing ? 'registration_challenge' : 'authentication_challenge';
		const challenge = cookies.get(challengeKey);

		if (!challenge) return fail(400, { message: 'Session expired. Please refresh the page.' });

		let userId: string;

		try {
			if (isRegistration) {
				const invite_id = url.searchParams.get('register')!;
				const user_invite = await super_pocketbase.collection('users').getOne(invite_id);

				const verified = await server.verifyRegistration(credential, {
					challenge,
					origin: url.origin
				});

				//await super_pocketbase.collection('_user_invites').delete(invite_id);

				const user = await super_pocketbase.collection('users').update(invite_id, {
					password: PASSKEY_AUTH_SECRET,
					passwordConfirm: PASSKEY_AUTH_SECRET,
					verified: true
				});
				await save_passkey(super_pocketbase, user.id, verified);

				userId = user.id;
			} else if (isPairing) {
				const pair_id = url.searchParams.get('pair')!;
				const device_invite = await super_pocketbase.collection('_passkey_invites').getOne(pair_id);

				const verified = await server.verifyRegistration(credential, {
					challenge,
					origin: url.origin
				});

				await super_pocketbase.collection('_passkey_invites').delete(pair_id);

				await save_passkey(super_pocketbase, device_invite.user, verified);

				userId = device_invite.user;
			} else {
				if (!/^[A-Za-z0-9_-]+$/.test(credential.id))
					return fail(400, { message: 'Invalid credential' });
				// Search for passkey by credential ID
				const storedPasskey = await super_pocketbase
					.collection('_passkeys')
					.getFirstListItem(`credential_id = "${credential.id}"`)
					.catch(() => {
						throw new Error('Passkey not found');
					});

				await server.verifyAuthentication(
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

function get_registration_options(
	challenge: string,
	rpId: string,
	appTitle: string,
	user: RecordModel
): PublicKeyCredentialCreationOptionsJSON {
	return {
		challenge,
		rp: { name: appTitle, id: rpId },
		user: { id: user.id, name: user.name, displayName: user.name },
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
}
async function save_passkey(
	super_pocketbase: any,
	userId: string,
	verified: Awaited<ReturnType<typeof server.verifyRegistration>>
) {
	await super_pocketbase.collection('_passkeys').create({
		user: userId,
		credential_id: verified.credential.id,
		public_key: verified.credential.publicKey,
		algorithm: verified.credential.algorithm,
		transports: verified.credential.transports || []
	});
}
