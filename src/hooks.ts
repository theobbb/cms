import { apps } from '$config/apps';
import type { Reroute } from '@sveltejs/kit';

// Routes accessible from any subdomain without app context
export const global_routes = ['public', 'help'];

// Routes that exist in [app] root (not in /apps folder)
const shared_routes = ['auth', 'users', 'info', 'profile', 'stats'];

export const reroute: Reroute = ({ url }) => {
	const subdomain = url.hostname.split('.')[0];
	const segments = url.pathname.split('/').filter(Boolean);
	const firstSegment = segments[0];

	// Global routes check (public, help)
	if (global_routes.includes(firstSegment)) {
		// If accessed via an app subdomain (e.g. annuel.localhost), inject it
		if (apps[subdomain]) {
			// Remove 'public' from the start
			const rest = segments.slice(1);

			// Reconstruct: /public/[subdomain]/[rest]
			// Input: /public/finissant-e-s
			// Output: /public/annuel/finissant-e-s
			return `/${firstSegment}/${subdomain}${rest.length ? '/' + rest.join('/') : ''}`;
		}

		return url.pathname;
	}

	// ... existing logic for standard app routes ...
	if (!apps[subdomain]) {
		return url.pathname;
	}

	// ... (rest of your existing function)
	const pathname = url.pathname.startsWith(`/${subdomain}`)
		? url.pathname
		: `/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;

	const [app, route, ...rest] = pathname.split('/').filter(Boolean);

	if (shared_routes.includes(route)) {
		return pathname;
	}

	const remainingPath = [route, ...rest].join('/');
	return `/${app}/apps/${app}${remainingPath ? '/' + remainingPath : ''}`;
};
