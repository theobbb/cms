import { apps } from '$config/apps';
import type { Reroute } from '@sveltejs/kit';

// Routes accessible from any subdomain without app context
export const global_routes = ['public', 'help'];

// Routes that exist in [app] root (not in /apps folder)
const shared_routes = ['auth', 'users', 'info', 'profile', 'stats'];

export const reroute: Reroute = ({ url }) => {
	const subdomain = url.hostname.split('.')[0];
	const firstSegment = url.pathname.split('/').filter(Boolean)[0];

	// Global routes pass through unchanged
	if (global_routes.includes(firstSegment)) {
		return url.pathname;
	}

	// If no valid subdomain, pass through (server hooks will handle redirect)
	if (!apps[subdomain]) {
		return url.pathname;
	}

	// Prepend app ID to pathname
	const pathname = url.pathname.startsWith(`/${subdomain}`)
		? url.pathname
		: `/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;

	// Parse segments after prepending
	const [app, route, ...rest] = pathname.split('/').filter(Boolean);

	// Shared routes stay in [app] root (e.g., /[app]/auth)
	if (shared_routes.includes(route)) {
		return pathname;
	}

	// All other routes go to [app]/apps/[app]/... structure
	const remainingPath = [route, ...rest].join('/');
	return `/${app}/apps/${app}${remainingPath ? '/' + remainingPath : ''}`;
};
