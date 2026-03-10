import type { CollectionField, CollectionModel, RecordModel } from 'pocketbase';
import type { Snippet } from 'svelte';

type ProcessCollectionOptions = {
	title?: string;
	record_title?: string;
	fields: {
		hidden?: string | string[];
		labels?: Record<string, string>;
		overrides?: Record<string, Partial<CollectionField>>;
		snippets?: Record<
			string,
			Partial<CollectionField> & { snippet: Snippet<[RecordModel]>; index?: number }
		>;
	};
};

export function process_collection(
	collection: CollectionModel,
	options: ProcessCollectionOptions
): CollectionModel {
	const { hidden = [], labels = {}, overrides = {}, snippets = {} } = options.fields;

	collection.title = options.title;
	collection.record_title = options.record_title;

	const hidden_keys = Array.isArray(hidden)
		? hidden
		: hidden
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean);

	const mappedFields: CollectionField[] = collection.fields.map((field) => {
		const override = overrides[field.name] || {};
		const snippet_override = snippets[field.name];
		return {
			...field,
			...override,
			...(labels[field.name] ? { label: labels[field.name] } : {}),
			...(snippet_override ? { snippet: snippet_override.snippet } : {}),
			hidden: field.hidden || hidden_keys.includes(field.name) || override.hidden
		} as CollectionField;
	});

	// Inject purely new snippet fields (those not matching any existing field name)
	const existingNames = new Set(collection.fields.map((f) => f.name));
	const newSnippets = Object.entries(snippets)
		.filter(([name]) => !existingNames.has(name))
		.map(([name, { snippet, index = 0, ...rest }]) => ({
			name,
			snippet,
			index,
			...rest
		}));

	// Insert new snippets at their target index
	const all_fields: CollectionField[] = [...mappedFields];
	for (const snippetField of newSnippets.sort((a, b) => a.index - b.index)) {
		all_fields.splice(snippetField.index, 0, snippetField);
	}

	return { ...collection, fields: all_fields };
}

// export function process_collection(
// 	collection: CollectionModel,
// 	options: ProcessCollectionOptions
// ): CollectionModel {
// 	const { hidden = [], labels = {}, overrides = {} } = options.fields;

// 	collection.title = options.title;
// 	collection.record_title = options.record_title;

// 	const hidden_keys = Array.isArray(hidden)
// 		? hidden
// 		: hidden
// 				.split(',')
// 				.map((s) => s.trim())
// 				.filter(Boolean);

// 	return {
// 		...collection,
// 		fields: collection.fields.map((field) => {
// 			const override = overrides[field.name] || {};
// 			return {
// 				...field,
// 				...override,
// 				...(labels[field.name] ? { label: labels[field.name] } : {}),
// 				hidden: field.hidden || hidden_keys.includes(field.name) || override.hidden
// 			};
// 		}) as CollectionField[]
// 	};
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

export function get_search_keys(search: string, keys: string[]): string {
	if (!search || !keys.length) return `id~"${search}"`;

	return keys.map((key) => `${key}~"${search}"`).join(' || ');
}
