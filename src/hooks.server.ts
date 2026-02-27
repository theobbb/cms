import { error, type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import PocketBase from 'pocketbase';
import { dev } from '$app/environment';
import { apps } from './config/apps';
import { global_routes } from './hooks';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';

// Helper to check if a route is global
function isGlobalRoute(pathname: string): boolean {
	const firstSegment = pathname.split('/').filter(Boolean)[0];
	return global_routes.includes(firstSegment);
}

// Helper to extract subdomain
function getSubdomain(hostname: string): string {
	return hostname.split('.')[0];
}

// Redirect duplicate app prefixes (e.g., /agraf/dashboard → /dashboard)
const subdomain_redirect: Handle = async ({ event, resolve }) => {
	if (isGlobalRoute(event.url.pathname)) {
		return resolve(event);
	}

	const subdomain = getSubdomain(event.url.hostname);

	if (apps[subdomain] && event.url.pathname.startsWith(`/${subdomain}/`)) {
		const newPath = event.url.pathname.substring(subdomain.length + 1);
		throw redirect(307, newPath + event.url.search);
	}

	return resolve(event);
};

const authentication: Handle = async ({ event, resolve }) => {
	const subdomain = getSubdomain(event.url.hostname);

	// 1. Check if the subdomain maps to a valid app
	if (!apps[subdomain]) {
		// If it's a global route (e.g. domain.com/public), allow it without App/PB context
		if (isGlobalRoute(event.url.pathname)) {
			return resolve(event);
		}
		// Otherwise, invalid subdomain -> redirect to help
		throw error(404, 'Page not found');
		//throw redirect(303, '/help');
	}

	// 2. Initialize App Context & PocketBase (Runs for ALL routes on valid subdomains)
	event.locals.app = apps[subdomain];
	event.locals.pocketbase = new PocketBase(event.locals.app.pocketbase.url);

	// Super instance (singleton, reuses token until expiry)
	event.locals.super_pocketbase = await super_auth_pocketbase(event.locals.app.pocketbase.url);

	// 3. Load Auth from cookie (It's okay if this remains empty for public routes)
	const cookie = event.request.headers.get('cookie');
	event.locals.pocketbase.authStore.loadFromCookie(cookie || '');
	event.locals.user = event.locals.pocketbase.authStore.record;

	// 4. Refresh auth if valid
	try {
		if (event.locals.pocketbase.authStore.isValid) {
			await event.locals.pocketbase.collection('users').authRefresh();
		} else {
			event.locals.user = null;
		}
	} catch (_) {
		event.locals.pocketbase.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);

	// 5. Set auth cookie
	const cookieHeader = event.locals.pocketbase.authStore.exportToCookie({
		secure: !dev,
		httpOnly: false,
		sameSite: 'Lax',
		path: '/'
	});

	response.headers.append('set-cookie', cookieHeader);

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
