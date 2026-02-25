import { goto } from '$app/navigation';
import { page } from '$app/state';
import { use_pocketbase } from '$lib/pocketbase';
import { url_query_param } from '$lib/utils/url';
import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';
import type { CollectionModel, RecordModel } from 'pocketbase';

export type EditorTarget =
	| { type: 'create'; collection: CollectionModel }
	| { type: 'update'; collection: CollectionModel; record: RecordModel };

export class Editor {
	current: EditorTarget | null = $state(null);
	loading: boolean = $state(false);
	#pocketbase = use_pocketbase();

	constructor() {
		// During SSR: peek at URL params so the shell/drawer renders immediately
		const type = page.url.searchParams.get('editor');
		const collection_name = page.url.searchParams.get('collection');
		const collection = page.data.collections?.[collection_name ?? ''];

		if (type && collection) {
			// We don't have the record yet, but we know the editor should be open
			if (type === 'create') {
				this.current = { type: 'create', collection };
			} else if (type === 'update') {
				// Mark loading — record will be filled in after mount
				this.loading = true;
				this.current = null; // or a skeleton sentinel if you prefer
			}
		}

		// Client only: hydrate with real data
		$effect(() => {
			if (!browser) return;
			this.#initFromUrl();
		});
	}

	async #initFromUrl() {
		const type = page.url.searchParams.get('editor');
		const collection_name = page.url.searchParams.get('collection');
		const record_id = page.url.searchParams.get('record');

		if (!type || !collection_name) return;

		const collection = page.data.collections?.[collection_name];
		if (!collection) return;

		if (type === 'create') {
			this.current = { type: 'create', collection };
			return;
		}

		if (type === 'update' && record_id) {
			// Check history state first (optimistic open from data table)
			const stashed = history.state?.editor as EditorTarget | undefined;
			if (stashed) {
				this.current = stashed;
				this.loading = false;
				return;
			}

			// Fallback: fetch (hard refresh / shared link)
			this.loading = true;
			const record = await this.#pocketbase.collection(collection_name).getOne(record_id);
			this.current = { type: 'update', collection, record };
			this.loading = false;
		}
	}

	open(editor: EditorTarget) {
		this.current = editor;
		this.loading = false;

		let url = page.url.href;
		url = url_query_param(url, 'editor', editor.type);
		url = url_query_param(url, 'collection', editor.collection.name);
		url = url_query_param(url, 'record', editor.type === 'update' ? editor.record.id : null);

		goto(url, { replaceState: true, state: { editor } });
	}

	close() {
		this.current = null;
		this.loading = false;

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
