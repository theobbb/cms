import { POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

// Per-URL cache of superuser PocketBase instances, shared across all server-side requests.
// A Map is used instead of a singleton to safely support multiple PocketBase URLs
// (e.g. multi-tenant setups), keyed by URL.
//
// This is safe because:
//   1. It lives in $lib/server/ — never bundled or exposed to the client
//   2. All requests use the same superuser identity, so shared auth state is not a concern
//   3. API methods (getOne, create, etc.) are stateless HTTP calls — no per-request state
//   4. The only mutable state is the auth token, which is re-authenticated automatically
//      when expired via authStore.isValid check
//   5. Each URL gets its own instance, so a URL change never reuses a stale connection
//
// Contrast with the regular `pocketbase` instance in hooks, which must be per-request
// because it holds each user's individual auth token.
const instances = new Map<string, PocketBase>();

export async function super_auth_pocketbase(url: string) {
	const existing = instances.get(url);
	if (existing?.authStore.isValid) return existing;
	const pb = new PocketBase(url);
	await pb
		.collection('_superusers')
		.authWithPassword(POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD);
	instances.set(url, pb);
	return pb;
}
