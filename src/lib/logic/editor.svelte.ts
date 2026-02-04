import { goto } from '$app/navigation';
import { page } from '$app/state';
import type { Collection } from '$config/types';
import { use_pocketbase } from '$lib/pocketbase';
import { url_query_param } from '$lib/utils/url';
import { getContext, setContext } from 'svelte';
import { get_collection } from './ctx.svelte';

export type EditorTarget =
	| { type: 'create'; collection: Collection<any> }
	| { type: 'update'; collection: Collection<any>; record: any };

export class Editor {
	current: EditorTarget | null = $state(null);
	#pocketbase = use_pocketbase();

	constructor() {
		// Read URL params once on init
		//this.#initFromUrl();
	}

	async #initFromUrl() {
		const type = page.url.searchParams.get('editor');
		const collection_name = page.url.searchParams.get('collection');
		const record_id = page.url.searchParams.get('record');
		// console.log(this.#collection);
		if (!type || !collection_name) return;

		const collection = page.data.app.collections[collection_name || ''];

		if (type === 'create') {
			this.current = { type: 'create', collection };
			return;
		}

		if (record_id) {
			// Fetch once on init
			const record = await this.#pocketbase.collection(collection_name).getOne(record_id);
			this.current = { type: 'update', collection, record };
		}
	}

	open(editor: EditorTarget) {
		this.current = editor;

		// Update URL for shareable state
		let url = page.url.href;
		url = url_query_param(url, 'editor', editor.type);
		url = url_query_param(url, 'collection', editor.collection.name);
		url = url_query_param(url, 'record', editor.type == 'update' ? editor.record.id : null);
		goto(url, { replaceState: true });
	}

	close() {
		this.current = null;

		let url = page.url.href;
		url = url_query_param(url, 'editor', null);
		url = url_query_param(url, 'collection', null);
		url = url_query_param(url, 'record', null);
		goto(url, { replaceState: true });
	}
}

const EDITOR_KEY = Symbol('EDITOR_KEY');

export function init_editor(): Editor {
	const instance = new Editor();
	setContext(EDITOR_KEY, instance);
	return instance;
}

export function use_editor(): Editor {
	return getContext<Editor>(EDITOR_KEY);
}
