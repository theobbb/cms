// src/hooks.ts
import type { Reroute } from '@sveltejs/kit';
import { dev } from '$app/environment';

const shared_routes = ['auth', 'users', 'info', 'profile', 'stats'];

// Map base domains to app IDs
const DOMAIN_TO_APP: Record<string, string> = {
	'client1domain.com': 'client1app',
	'client2domain.com': 'client2app',
	'client3domain.com': 'client3app'
};

function getAppFromHostname(hostname: string): string | null {
	// Development: app1.localhost:5173 → app1
	if (dev && hostname.includes('.localhost')) {
		const match = hostname.match(/^([^.]+)\.localhost/);
		return match ? match[1] : null;
	}

	// Production: admin.client1domain.com → client1app
	if (hostname.startsWith('admin.')) {
		const baseDomain = hostname.replace(/^admin\./, '');
		return DOMAIN_TO_APP[baseDomain] || null;
	}

	return null;
}

export const reroute: Reroute = ({ url }) => {
	let pathname = url.pathname;
	const hostname = url.hostname;

	const mappedAppId = getAppFromHostname(hostname);

	if (mappedAppId) {
		if (!pathname.startsWith(`/${mappedAppId}`)) {
			pathname = `/${mappedAppId}${pathname}`;
		}
	}

	const segments = pathname.split('/').filter(Boolean);
	const [app, ...rest] = segments;

	if (app === 'public') return pathname;
	if (shared_routes.includes(rest[0])) return pathname;

	return `/${app}/apps/${app}/${rest.join('/')}`;
};
