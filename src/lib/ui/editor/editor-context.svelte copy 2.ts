// editor.svelte.ts
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { use_pocketbase } from '$lib/pocketbase';
import { url_query_param } from '$lib/utils/url';
import type { CollectionModel, RecordModel } from 'pocketbase';

export type EditorTarget =
	| { method: 'create'; collection: CollectionModel }
	| { method: 'update'; collection: CollectionModel; record: RecordModel };

export class Editor {
	target: EditorTarget | null = $state(null);
	#pocketbase = use_pocketbase();

	constructor(collection?: CollectionModel) {
		// Pass the collection in so the URL initialization knows what it's looking for
		this.#initFromUrl(collection);
	}

	async #initFromUrl(local_collection?: CollectionModel) {
		const type = page.url.searchParams.get('editor');
		const collection_name = page.url.searchParams.get('collection');
		const record_id = page.url.searchParams.get('record');

		if (!type || !collection_name || !local_collection) return;
		if (local_collection.name !== collection_name) return; // Prevent wrong table from opening

		if (type === 'create') {
			this.target = { method: 'create', collection: local_collection };
			return;
		}

		if (record_id) {
			let query = {};
			const relation_fields = local_collection.fields
				.filter((f) => f.type === 'relation')
				.map((f) => f.name)
				.join(',');

			if (relation_fields) query = { expand: relation_fields };

			const record = await this.#pocketbase.collection(collection_name).getOne(record_id, query);
			this.target = { method: 'update', collection: local_collection, record };
		}
	}

	open(editor: EditorTarget) {
		this.target = editor;
		let url = page.url.href;
		url = url_query_param(url, 'editor', editor.method);
		url = url_query_param(url, 'collection', editor.collection.name);
		url = url_query_param(url, 'record', editor.method == 'update' ? editor.record.id : null);
		goto(url, { replaceState: true });
	}

	close() {
		this.target = null;
		let url = page.url.href;
		url = url_query_param(url, 'editor', null);
		url = url_query_param(url, 'collection', null);
		url = url_query_param(url, 'record', null);
		goto(url, { replaceState: true });
	}
}

export async function load_editor(): Editor | null {
	const type = page.url.searchParams.get('editor');
	const collection_name = page.url.searchParams.get('collection');
	const record_id = page.url.searchParams.get('record');

	if (!type || !collection_name || !local_collection) return null;
	if (local_collection.name !== collection_name) return null; // Prevent wrong table from opening

	if (type === 'create') {
		return new Editor();
		this.target = { method: 'create', collection: local_collection };
		return;
	}

	if (record_id) {
		let query = {};
		const relation_fields = local_collection.fields
			.filter((f) => f.type === 'relation')
			.map((f) => f.name)
			.join(',');

		if (relation_fields) query = { expand: relation_fields };

		const record = await this.#pocketbase.collection(collection_name).getOne(record_id, query);
		this.target = { method: 'update', collection: local_collection, record };
	}
}
