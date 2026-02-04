import PocketBase from 'pocketbase';
import { getContext, setContext } from 'svelte';

const POCKETBASE_KEY = Symbol('POCKETBASE_KEY');

export function init_pocketbase(url: string, server_auth: string) {
	const pocketbase = new PocketBase(url);
	pocketbase.authStore.loadFromCookie(server_auth);
	setContext(POCKETBASE_KEY, pocketbase);
}
export function use_pocketbase(): PocketBase {
	const context = getContext<PocketBase>(POCKETBASE_KEY);
	if (!context) {
		throw new Error('Pocketbase context not found. Make sure you set it in a parent component.');
	}
	return context;
}
//export const pocketbase = new PocketBase(PUBLIC_POCKETBASE_URL);
