import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import PocketBase from 'pocketbase';

import { dev } from '$app/environment';
import { apps } from './config/apps';

const authentification: Handle = async ({ event, resolve }) => {
	if (!event.params.app) return await resolve(event);

	event.locals.app = apps[event.params.app || ''];
	if (!event.locals.app) redirect(303, '/');

	event.locals.pocketbase = new PocketBase(event.locals.app.pocketbase.url);

	const cookie = event.request.headers.get('cookie');
	event.locals.pocketbase.authStore.loadFromCookie(cookie || '');
	event.locals.user = event.locals.pocketbase.authStore.record;

	try {
		if (event.locals.pocketbase.authStore.isValid) {
			await event.locals.pocketbase.collection('users').authRefresh();
			//event.locals.user = event.locals.pocketbase.authStore.record;
		} else {
			event.locals.user = null;
		}
	} catch (_) {
		event.locals.pocketbase.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);

	const cookie_options = event.locals.pocketbase.authStore.exportToCookie({
		secure: !dev, // True in production, False in development (http)
		httpOnly: false,
		sameSite: 'Lax',
		path: `/${event.params.app}`
	});
	// if (!dev) {
	// 	// PUBLIC_POCKETBASE_DOMAIN should be your root domain (e.g., 'myapp.com')
	// 	cookie_options.domain = '.annuel.3xw.ca';
	// }
	response.headers.append('set-cookie', cookie_options);

	return response;
};

const authorization: Handle = async ({ event, resolve }) => {
	if (!event.locals.app) return await resolve(event);

	const auth_route = `/${event.params.app}/auth`;
	event.locals.public_route = event.url.pathname.startsWith(auth_route);

	const auth = event.locals.pocketbase.authStore.isValid;

	if (!auth && !event.locals.public_route) {
		redirect(303, auth_route);
	}
	if (auth && event.url.pathname == `/${event.params.app}/auth`)
		redirect(303, `/${event.params.app}`);

	return resolve(event);
};

export const handle: Handle = sequence(authentification, authorization);
