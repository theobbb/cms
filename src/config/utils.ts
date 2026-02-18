import type { CollectionModel } from 'pocketbase';

// export function process_collections(
// 	collections: CollectionModel[]
// ): Record<string, CollectionModel> {
// 	for (const collection of collections) {
// 		collection.fields = collection.fields.filter(
// 			(field) => !field.hidden && field.name != 'id' && field.name != 'emailVisibility'
// 		);
// 		collection.field_map = Object.fromEntries(
// 			collection.fields.map((field) => [field.name, field])
// 		);

// 		collection.presentable_keys = get_collection_presentable_keys(collection);
// 	}
// 	return Object.fromEntries(
// 		collections.map((col) => [
// 			col.name,
// 			{
// 				...col,
// 				// We ensure 'name' is present in the value as well
// 				name: col.name
// 			}
// 		])
// 	);
// }
export function process_collections(collections: CollectionModel[]): {
	collections: Record<string, CollectionModel>;
	id_collections: Record<string, CollectionModel>;
} {
	for (const collection of collections) {
		collection.fields = collection.fields.filter(
			(field) => !field.hidden && field.name != 'id' && field.name != 'emailVisibility'
		);
		collection.field_map = Object.fromEntries(
			collection.fields.map((field) => [field.name, field])
		);
		collection.presentable_keys = get_collection_presentable_keys(collection);
	}

	const by_name: Record<string, CollectionModel> = {};
	const by_id: Record<string, CollectionModel> = {};

	for (const col of collections) {
		const entry = { ...col, name: col.name };
		by_name[col.name] = entry;
		by_id[col.id] = entry;
	}

	return { collections: by_name, id_collections: by_id };
}

export function get_collection_presentable_keys(collection: CollectionModel): string[] {
	return collection.fields.reduce<string[]>((acc, { presentable, name }) => {
		if (presentable) acc.push(name);
		return acc;
	}, []);
}

export function search_keys(search: string, keys: string[]) {
	if (!search || !keys.length) return '';

	return keys.map((key) => `${key}~"${search}"`).join(' || ');
}
