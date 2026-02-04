// src/routes/auth/callback/+server.ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	// Retrieve the stored verification tokens from cookies
	const storedState = cookies.get('state');
	const storedVerifier = cookies.get('verifier');

	if (!code || !storedState || !storedVerifier || state !== storedState) {
		console.error('Missing or mismatching auth parameters.');
		redirect(303, '/auth');
	}

	try {
		// 1. Exchange the code and verifier for a valid PocketBase session token
		await locals.pocketbase.collection('users').authWithOAuth2Code(
			'google', // The provider name
			code,
			storedVerifier,
			// The final URL is the one you copied from PocketBase and put into Google Console
			url.origin + '/auth/callback'
		);
	} catch (err) {
		console.error('OAuth2 authentication failed:', err);
		redirect(303, '/auth');
	}

	// 2. Clear the temporary cookies
	cookies.delete('state', { path: '/' });
	cookies.delete('verifier', { path: '/' });

	// 3. Success! Redirect to the dashboard.
	redirect(303, '/dashboard');
};
