import { POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

export async function super_auth_pocketbase(url: string) {
	const super_pocketbase = new PocketBase(url);
	await super_pocketbase
		.collection('_superusers')
		.authWithPassword(POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD);
	return super_pocketbase;
}
