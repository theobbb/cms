import { POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

// Singleton superuser PocketBase instance, shared across all server-side requests.
// This is safe because:
//   1. It lives in $lib/server/ — never bundled or exposed to the client
//   2. All requests use the same superuser identity, so shared auth state is not a concern
//   3. API methods (getOne, create, etc.) are stateless HTTP calls — no per-request state
//   4. The only mutable state is the auth token, which is re-authenticated automatically
//      when expired via authStore.isValid check
// Contrast with the regular `pocketbase` instance in hooks, which must be per-request
// because it holds each user's individual auth token.

let instance: PocketBase | null = null;

export async function super_auth_pocketbase(url: string) {
	if (instance?.authStore.isValid) return instance;
	instance = new PocketBase(url);
	await instance
		.collection('_superusers')
		.authWithPassword(POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD);
	return instance;
}

// export async function super_auth_pocketbase(url: string) {
// 	const super_pocketbase = new PocketBase(url);
// 	await super_pocketbase
// 		.collection('_superusers')
// 		.authWithPassword(POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD);
// 	return super_pocketbase;
// }
