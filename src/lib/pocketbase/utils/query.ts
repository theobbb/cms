// $config/utils or $lib/utils/pocketbase-query.ts

import type { CollectionModel } from 'pocketbase';

export function build_relation_query(
	collection: CollectionModel,
	id_collections: Record<string, CollectionModel>
): { expand: string; fields: string } | null {
	const relation_fields = collection.fields.filter((f) => f.type === 'relation');
	if (!relation_fields.length) return null;

	const expand_list: string[] = [];
	const fields_list: string[] = [];

	const process_relation = (rel_name: string, collection_id: string, prefix: string) => {
		expand_list.push(prefix ? `${prefix}.${rel_name}` : rel_name);

		const related_collection = id_collections[collection_id];
		if (!related_collection) return;

		const presentable_keys = related_collection.presentable_keys as string[];
		if (!presentable_keys.length) return;

		const expand_prefix = prefix ? `expand.${prefix}.expand.${rel_name}` : `expand.${rel_name}`;

		fields_list.push(
			...['id', 'collectionId', 'collectionName', ...presentable_keys].map(
				(key) => `${expand_prefix}.${key}`
			)
		);

		for (const key of presentable_keys) {
			const field = related_collection.field_map?.[key];
			if (field?.type === 'relation' && field.collectionId) {
				process_relation(key, field.collectionId, prefix ? `${prefix}.${rel_name}` : rel_name);
			}
		}
	};

	for (const rel of relation_fields) {
		process_relation(rel.name, rel.collectionId, '');
	}

	return { expand: expand_list.join(','), fields: fields_list.join(',') };
}
