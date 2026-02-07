import { process_collections } from '$config/utils';
import { POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

export async function load({ locals: { app, pocketbase, user, public_route } }) {
	const super_pocketbase = new PocketBase(app.pocketbase.url);
	await super_pocketbase
		.collection('_superusers')
		.authWithPassword(POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD);
	const collections = await super_pocketbase.collections.getFullList({
		filter: 'system = false',
		fields: 'id,fields,name,updateRule,viewRule,createRule,deleteRule'
	});

	for (const collection of collections) {
		collection.fields = collection.fields.filter(
			(field) => !field.hidden && field.name != 'id' && field.name != 'emailVisibility'
		);
		collection.field_map = Object.fromEntries(
			collection.fields.map((field) => [field.name, field])
		);
	}

	return {
		app,
		collections: process_collections(collections),

		user,
		server_auth: pocketbase.authStore.exportToCookie(),
		public_route
	};
}
