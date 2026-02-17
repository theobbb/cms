import { apps } from '$config/apps';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';

export async function load() {
	const super_pocketbase = await super_auth_pocketbase(apps.annuel.pocketbase.url);
	const collection = await super_pocketbase.collections.getFirstListItem('name = "students"');

	collection.fields = collection.fields.filter(
		(field) => !field.hidden && field.name != 'id' && field.name != 'emailVisibility'
	);
	collection.field_map = Object.fromEntries(collection.fields.map((field) => [field.name, field]));

	return { collection };
}
