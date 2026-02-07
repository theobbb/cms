import { json, error } from '@sveltejs/kit';
import { server } from '@passwordless-id/webauthn';

export async function POST({ request, cookies, locals: { pocketbase }, params }) {
	const { user_id, credential } = await request.json();

	// Retrieve the challenge we set in the previous step
	const expected_challenge = cookies.get('registration_challenge');

	if (!expected_challenge) {
		throw error(400, 'Challenge expired or missing. Please try again.');
	}

	try {
		const verified = await server.verifyRegistration(credential, {
			challenge: expected_challenge,
			origin: 'http://localhost:5173'
		});

		// Clean up: delete the challenge cookie after successful verification
		cookies.delete('registration_challenge', { path: '/' + params.app });

		// Save to PocketBase...
		await pocketbase.collection('passkeys').create({
			user: user_id,
			credential_id: verified.credential.id,
			public_key: verified.credential.publicKey,
			algorithm: verified.credential.algorithm
		});

		return json({ success: true });
	} catch (err) {
		console.error(err);
		throw error(400, 'Verification failed');
	}
}
