import { dev } from '$app/environment';
import { PASSKEY_AUTH_SECRET } from '$env/static/private';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { server } from '@passwordless-id/webauthn';
import { fail, redirect, type Actions } from '@sveltejs/kit';

const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'strict',
	secure: !dev,
	maxAge: 60 * 60
} as const;

export async function load({ url, cookies, locals: { app } }) {
	const register_id = url.searchParams.get('register');
	const pair_id = url.searchParams.get('pair');

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

		try {
			const register_user = await super_pocketbase.collection('_user_invites').getOne(register_id);

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

	// Device Connect Flow
	if (pair_id) {
		const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);

		try {
			const device_invite = await super_pocketbase.collection('_device_invites').getOne(pair_id);

			cookies.set('registration_challenge', challenge, cookie_options);

			// Fetch the existing user to populate the passkey user info
			const existing_user = await super_pocketbase.collection('users').getOne(device_invite.user);

			options = {
				challenge,
				rp: { name: app.title, id: rpId },
				user: {
					id: existing_user.id,
					name: existing_user.name,
					displayName: existing_user.name
				},
				pubKeyCredParams: [
					{ type: 'public-key', alg: -7 },
					{ type: 'public-key', alg: -257 }
				],
				timeout: 60000,
				attestation: 'none',
				authenticatorSelection: {
					residentKey: 'preferred',
					userVerification: 'required'
				}
			} satisfies PublicKeyCredentialCreationOptionsJSON;

			return { register: null, connect: device_invite, options };
		} catch (e) {
			return {
				register: null,
				connect: null,
				options: null,
				error: 'Invalid device connection link'
			};
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
		const isPairing = url.searchParams.has('pair');

		const formData = await request.formData();
		const credentialJSON = formData.get('credential') as string;

		if (!credentialJSON) {
			return fail(400, { message: 'Missing credentials' });
		}

		// Parse the JSON.toJSON() output from the client
		const credential = JSON.parse(credentialJSON);
		const challengeKey =
			isRegistration || isPairing ? 'registration_challenge' : 'authentication_challenge';
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
			} else if (isPairing) {
				const pair_id = url.searchParams.get('pair')!;
				const device_invite = await super_pocketbase.collection('_device_invites').getOne(pair_id);

				const verified = await server.verifyRegistration(credential, {
					challenge,
					origin: url.origin
				});

				await super_pocketbase.collection('_device_invites').delete(pair_id);

				await super_pocketbase.collection('_passkeys').create({
					user: device_invite.user,
					credential_id: verified.credential.id,
					public_key: verified.credential.publicKey,
					algorithm: verified.credential.algorithm,
					transports: verified.credential.transports || []
				});

				userId = device_invite.user;
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

function get_registration_options(
	challenge: string,
	rpId: string,
	appTitle: string,
	user: { id: string; name: string }
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
