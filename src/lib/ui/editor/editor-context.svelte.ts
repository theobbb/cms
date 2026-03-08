// editor.svelte.ts
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { use_pocketbase } from '$lib/pocketbase';
import { url_query_param } from '$lib/utils/url';
import type { CollectionModel, RecordModel } from 'pocketbase';
import { getContext, setContext } from 'svelte';

export type EditorTarget = { method: 'create' } | { method: 'update'; record: RecordModel };

export class Editor {
	current: EditorTarget | null = $state(null);
	collection: CollectionModel;

	#pocketbase = use_pocketbase();

	constructor(collection: CollectionModel) {
		this.collection = collection;
		this.#init_from_url();
	}

	async #init_from_url() {
		const method = page.url.searchParams.get('editor');
		const record_id = page.url.searchParams.get('record');

		if (!method) return;

		if (method === 'create') {
			this.current = { method: 'create' };
			return;
		}

		if (record_id) {
			let query = {};
			const relation_fields = this.collection.fields
				.filter((f) => f.type === 'relation')
				.map((f) => f.name)
				.join(',');

			if (relation_fields) query = { expand: relation_fields };

			const record = await this.#pocketbase.collection(this.collection.id).getOne(record_id, query);
			this.current = { method: 'update', record };
		}
	}

	open(editor: EditorTarget) {
		this.current = editor;
		let url = page.url.href;
		url = url_query_param(url, 'editor', editor.method);
		url = url_query_param(url, 'record', editor.method == 'update' ? editor.record.id : null);
		goto(url, { replaceState: true });
	}

	close() {
		this.current = null;
		let url = page.url.href;
		url = url_query_param(url, 'editor', null);
		url = url_query_param(url, 'record', null);
		goto(url, { replaceState: true });
	}
}

const EDITOR_KEY = Symbol('EDITOR_KEY');

export function init_editor(collection: CollectionModel): Editor {
	const instance = new Editor(collection);
	setContext(EDITOR_KEY, instance);
	return instance;
}

export function use_editor(): Editor {
	return getContext<Editor>(EDITOR_KEY);
}
