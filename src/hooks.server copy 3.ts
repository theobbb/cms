import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import PocketBase from 'pocketbase';
import { dev } from '$app/environment';
import { apps } from './config/apps';
import { global_routes } from './hooks';

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

// Initialize PocketBase and load user session
const authentication: Handle = async ({ event, resolve }) => {
	if (isGlobalRoute(event.url.pathname)) {
		return resolve(event);
	}

	const subdomain = getSubdomain(event.url.hostname);

	if (!apps[subdomain]) {
		throw redirect(303, '/help');
	}

	// Set up app context and PocketBase
	event.locals.app = apps[subdomain];
	event.locals.pocketbase = new PocketBase(event.locals.app.pocketbase.url);

	// Load auth from cookie
	const cookie = event.request.headers.get('cookie');
	event.locals.pocketbase.authStore.loadFromCookie(cookie || '');
	event.locals.user = event.locals.pocketbase.authStore.record;

	// Refresh auth if valid
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

	// Set auth cookie
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
