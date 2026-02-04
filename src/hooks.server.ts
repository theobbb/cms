import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import PocketBase from 'pocketbase';

import { dev } from '$app/environment';
import { apps } from './config/apps';

const authentification: Handle = async ({ event, resolve }) => {
	if (!event.params.app) return await resolve(event);

	event.locals.app = apps[event.params.app || ''];

	if (!event.locals.app) redirect(303, '/');

	const cookie = event.request.headers.get('cookie');

	event.locals.pocketbase = new PocketBase(event.locals.app.pocketbase.url);

	// load the store data from the request cookie string
	event.locals.pocketbase.authStore.loadFromCookie(cookie || '');
	event.locals.user = event.locals.pocketbase.authStore.record;

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pocketbase.authStore.isValid &&
			(await event.locals.pocketbase.collection('users').authRefresh());
		//event.locals.user = event.locals.pocketbase.authStore.record;
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pocketbase.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);

	const cookie_options = {
		secure: !dev, // True in production, False in development (http)
		httpOnly: false,
		sameSite: 'Lax',
		path: `/${event.params.app}`
	};
	// if (!dev) {
	// 	// PUBLIC_POCKETBASE_DOMAIN should be your root domain (e.g., 'myapp.com')
	// 	cookie_options.domain = '.annuel.3xw.ca';
	// }

	// Export the auth store state to the cookie
	response.headers.append(
		'set-cookie',
		event.locals.pocketbase.authStore.exportToCookie(cookie_options)
	);

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

	return resolve(event);
};

export const handle: Handle = sequence(authentification, authorization);
