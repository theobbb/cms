import type { Reroute } from '@sveltejs/kit';

const shared_routes = ['auth', 'users', 'info', 'profile', 'stats'];

export const reroute: Reroute = ({ url }) => {
	const segments = url.pathname.split('/').filter(Boolean);

	const [app, ...rest] = segments;

	if (app == 'public') return;
	if (shared_routes.includes(rest[0])) return;

	// Reroute to /[app]/apps/{app}/{rest...}
	// e.g. /app1/dashboard → /[app]/apps/app1/dashboard
	return `/${app}/apps/${app}/${rest.join('/')}`;
};
