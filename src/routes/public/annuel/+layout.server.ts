import { process_collections } from '$config/utils';
import { apps } from '$config/apps';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { POCKETBASE_SYSTEM_EMAIL, POCKETBASE_SYSTEM_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

export async function load({ locals: { app } }) {
	const super_pocketbase = await super_auth_pocketbase(apps.annuel.pocketbase.url);

	const collections = await super_pocketbase.collections.getFullList({
		filter: 'name = "students" || name = "projects"',
		sort: 'name',
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

	return { collections: process_collections(collections) };
}
