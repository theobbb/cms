import { error, type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import PocketBase from 'pocketbase';
import { dev } from '$app/environment';
import { apps } from './config/apps';
import { global_routes } from './hooks';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { resolveAppKey } from './utils';

// Helper to check if a route is global
function isGlobalRoute(pathname: string): boolean {
	const firstSegment = pathname.split('/').filter(Boolean)[0];
	return global_routes.includes(firstSegment);
}

// Redirect duplicate app prefixes (e.g., /agraf/dashboard → /dashboard)
const subdomain_redirect: Handle = async ({ event, resolve }) => {
	if (isGlobalRoute(event.url.pathname)) return resolve(event);

	const appKey = resolveAppKey(event.url.hostname);

	if (apps[appKey] && event.url.pathname.startsWith(`/${appKey}/`)) {
		const newPath = event.url.pathname.substring(appKey.length + 1);
		throw redirect(307, newPath + event.url.search);
	}

	return resolve(event);
};

const authentication: Handle = async ({ event, resolve }) => {
	const appKey = resolveAppKey(event.url.hostname);

	if (!apps[appKey]) {
		if (isGlobalRoute(event.url.pathname)) return resolve(event);
		throw error(404, 'Page not found');
	}

	// 2. Initialize App Context & PocketBase (Runs for ALL routes on valid subdomains)
	event.locals.app = apps[appKey];

	event.locals.pocketbase = new PocketBase(event.locals.app.pocketbase.url);
	event.locals.super_pocketbase = await super_auth_pocketbase(event.locals.app.pocketbase.url);

	// Load session auth from cookie
	const cookie = event.request.headers.get('cookie');
	event.locals.pocketbase.authStore.loadFromCookie(cookie || '');

	event.locals.session = null;
	event.locals.user = null;

	event.locals.user = event.locals.pocketbase.authStore.record;

	try {
		if (event.locals.pocketbase.authStore.isValid) {
			// Refresh and expand the user relation in one call
			await event.locals.pocketbase.collection('sessions').authRefresh({ expand: 'user' });

			event.locals.session = event.locals.pocketbase.authStore.record;
			event.locals.user = event.locals.session?.expand?.user ?? null;

			// Update last_seen (fire and forget)
			event.locals.super_pocketbase
				.collection('sessions')
				.update(event.locals.session.id, { last_seen: new Date().toISOString() })
				.catch(() => {});
		} else {
			event.locals.pocketbase.authStore.clear();
		}
	} catch {
		event.locals.pocketbase.authStore.clear();
	}

	const response = await resolve(event);

	response.headers.append(
		'set-cookie',
		event.locals.pocketbase.authStore.exportToCookie({
			secure: !dev,
			httpOnly: false,
			sameSite: 'Lax',
			path: '/'
		})
	);

	return response;
};

// Protect routes that require authentication
const authorization: Handle = async ({ event, resolve }) => {
	if (isGlobalRoute(event.url.pathname)) {
		return resolve(event);
	}

	const isAuthRoute = event.route.id?.includes('/auth') || false;
	event.locals.public_route = isAuthRoute;

	const isAuthenticated = event.locals.pocketbase.authStore.isValid;

	if (!isAuthenticated && !event.locals.public_route) {
		throw redirect(303, '/auth');
	}

	return resolve(event);
};

export const handle: Handle = sequence(subdomain_redirect, authentication, authorization);
