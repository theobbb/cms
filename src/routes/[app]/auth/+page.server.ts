import { dev } from '$app/environment';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { UAParser } from 'ua-parser-js';

const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'strict',
	secure: !dev,
	maxAge: 60 * 60 * 24 * 365 // 1 year
} as const;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function load({ locals: { super_pocketbase }, url }) {
	const token = url.searchParams.get('register');
	if (!token) return { user: null };

	try {
		const session = await super_pocketbase
			.collection('sessions')
			.getFirstListItem(`id = "${token}" && verified = false`, { expand: 'user' });

		return { user: session.expand?.user ?? null };
	} catch {
		return error(400, 'Invalid or expired invite link.');
	}
}

export const actions: Actions = {
	default: async ({
		request,
		cookies,
		locals: { pocketbase, super_pocketbase, ...locals },
		url
	}) => {
		const token = url.searchParams.get('register');
		if (!token) return fail(400, { error: 'No token provided.' });

		try {
			// delete previous session
			if (locals.session) {
				pocketbase.collection('sessions').delete(locals.session.id);
			}

			const session = await super_pocketbase
				.collection('sessions')
				.getFirstListItem(`id = "${token}" && verified = false`, { expand: 'user' });

			// Auto-generate device label from user agent
			const ua = new UAParser(request.headers.get('user-agent') ?? '');
			const os = [ua.getOS().name, ua.getOS().version].filter(Boolean).join(' '); // "Windows 10"
			const user_agent = [
				ua.getBrowser().name, // "Firefox"
				os // "Windows 10"
			]
				.filter(Boolean)
				.join(', ');

			const password = crypto.randomUUID();
			await super_pocketbase.collection('sessions').update(session.id, {
				verified: true,
				password: password,
				passwordConfirm: password,
				user_agent,
				origin: url.hostname,
				last_seen: new Date().toISOString()
			});

			// Authenticate as this session row to get a JWT
			await pocketbase.collection('sessions').authWithPassword(session.identity, password);

			const cookie_header = pocketbase.authStore.exportToCookie({
				secure: !dev,
				httpOnly: true,
				sameSite: 'Strict',
				path: '/',
				maxAge: COOKIE_OPTIONS.maxAge
			});

			cookies.set('pb_auth', cookie_header, COOKIE_OPTIONS);

			redirect(303, '/');
		} catch (e: any) {
			if (e.status === 303) throw e;
			console.log(e);
			return fail(400, { error: 'Invalid or expired invite link.' });
		}
	}
};
