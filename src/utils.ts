import { apps } from '$config/apps';

// Helper to resolve hostname → app key
export function resolveAppKey(hostname: string): string {
	// First try subdomain as normal
	const subdomain = hostname.split('.')[0];
	if (apps[subdomain]) return subdomain;

	// Fall back to checking aliases across all apps
	const lowerHost = hostname.toLowerCase();
	const match = Object.entries(apps).find(([_, app]) =>
		app.aliases?.some((alias) => alias === lowerHost)
	);

	return match ? match[0] : subdomain; // return subdomain as fallback (will 404 naturally)
}
