import { goto } from '$app/navigation';
import { page } from '$app/state';
import type { Collection } from '$config/types';
import { use_pocketbase } from '$lib/pocketbase';
import { url_query_param } from '$lib/utils/url';
import { getContext, setContext } from 'svelte';

export type EditorTarget =
	| { type: 'create'; collection: Collection<any> }
	| { type: 'update'; collection: Collection<any>; record: any };

export class Editor {
	//current: SectionEditor = $state(null);
	_cached_record = $state<any>(null);

	#pocketbase = use_pocketbase();

	current: EditorTarget | null = $derived.by(() => {
		const type = page.url.searchParams.get('editor');
		const collection_name = page.url.searchParams.get('collection');
		const record_id = page.url.searchParams.get('record');

		if (!type || !collection_name) return null;

		const collection = page.data.app.collections[collection_name || ''];
		if (type === 'create') return { type: 'create', collection };

		// 1. Check if our cached target matches the URL ID
		if (this._cached_record && this._cached_record.id === record_id) {
			return { type: 'update', collection, record: this._cached_record };
		}
		if (!record_id) return null;

		// 2. Fallback: Lookup in page data (for refresh/direct link)
		this.#fetch(collection_name, record_id);
		return null;
		// const record = last_section?.collection.data?.items.find((record) => record.id == target_id);

		// return { type: 'update', collection, record: this._cached_record };
	});

	async #fetch(collection: string, record_id: string) {
		console.log('fetching');
		this._cached_record = await this.#pocketbase.collection(collection).getOne(record_id);
	}

	open(editor: EditorTarget) {
		if (editor.type === 'update') {
			this._cached_record = editor.record;
		}

		let url = page.url.href;
		url = url_query_param(url, 'editor', editor.type);
		url = url_query_param(url, 'collection', editor.collection.name);
		url = url_query_param(url, 'record', editor.type == 'update' ? editor.record.id : null);

		goto(url, { replaceState: true });
		//keepFocus: true
	}

	close() {
		this._cached_record = null;
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
