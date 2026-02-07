import { dev } from '$app/environment';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { server } from '@passwordless-id/webauthn';
import { fail, json } from '@sveltejs/kit';

export async function POST({ request, locals: { pocketbase, app }, cookies, params }) {
	const { name_or_email } = await request.json();

	if (!name_or_email) fail(500, 'No username or email');

	const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);
	const user = await super_pocketbase
		.collection('users')
		.getFirstListItem(`name = "${name_or_email}" || email = "${name_or_email}"`);

	const challenge = server.randomChallenge();

	// Store challenge in a secure cookie (valid for 5 minutes)
	cookies.set('registration_challenge', challenge, {
		path: '/' + params.app,
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60 * 5
	});

	// Return JSON-serializable options (browser will parse with parseCreationOptionsFromJSON)
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
