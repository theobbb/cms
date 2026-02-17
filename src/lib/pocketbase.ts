import PocketBase from 'pocketbase';
import { getContext, setContext } from 'svelte';

const POCKETBASE_KEY = Symbol('POCKETBASE_KEY');

export function init_pocketbase(url: string, server_auth: string): PocketBase {
	const pocketbase = new PocketBase(url);
	pocketbase.authStore.loadFromCookie(server_auth);
	setContext(POCKETBASE_KEY, pocketbase);
	return pocketbase;
}
export function use_pocketbase(): PocketBase {
	return getContext<PocketBase>(POCKETBASE_KEY);
}
