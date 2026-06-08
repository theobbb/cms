import { dev } from '$app/environment';
import { PASSKEY_AUTH_SECRET } from '$env/static/private';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';

const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'strict',
	secure: !dev,
	maxAge: 60 * 60 * 24 * 365 // 1 year
} as const;

export async function load({ locals: { pocketbase, super_pocketbase }, url }) {
	const token = url.searchParams.get('token');
	if (!token) return;

	try {
		const invite = await super_pocketbase.collection('_auth_invites').getOne(token);
		const user = await super_pocketbase.collection('users').getOne(invite.user);

		return { invite, user };
	} catch (e: any) {
		if (e.status === 303) throw e;
		return error(500, 'Invalid or expired invite link.');
	}
}

export const actions: Actions = {
	default: async ({ cookies, locals: { pocketbase, super_pocketbase }, url }) => {
		const token = url.searchParams.get('token');

		if (!token) {
			return fail(400, { error: 'no token' });
		}
		console.log(token);
		try {
			const invite = await super_pocketbase.collection('_auth_invites').getOne(token);
			console.log(invite);
			const user = await super_pocketbase.collection('users').getOne(invite.user);

			// Mark user as verified if not already
			if (!user.verified) {
				await super_pocketbase.collection('users').update(user.id, {
					password: PASSKEY_AUTH_SECRET,
					passwordConfirm: PASSKEY_AUTH_SECRET,
					verified: true
				});
			}

			// Consume the token
			await super_pocketbase.collection('_auth_invites').delete(invite.id);

			// Authenticate and set long-lived cookie
			await pocketbase.collection('users').authWithPassword(user.name, PASSKEY_AUTH_SECRET);

			const cookieHeader = pocketbase.authStore.exportToCookie({
				secure: !dev,
				httpOnly: true,
				sameSite: 'Strict',
				path: '/',
				maxAge: COOKIE_OPTIONS.maxAge
			});

			cookies.set('pb_auth', cookieHeader, COOKIE_OPTIONS);

			redirect(303, '/');
		} catch (e: any) {
			if (e.status === 303) throw e;
			return fail(500, { error: 'Invalid or expired invite link.' });
		}
	}
};
