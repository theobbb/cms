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
	base_query = {};

	draft_data: Record<string, any> | null = $state(null);

	#pocketbase = use_pocketbase();

	constructor(collection: CollectionModel, query = {}) {
		this.collection = collection;
		this.base_query = query;
		this.#init_from_url();
	}

	get draft_key() {
		if (!this.current) return null;
		const id = this.current.method === 'create' ? `create` : this.current.record.id;
		return `editor_draft_${this.collection.id}_${id}`;
	}

	get expand_string() {
		return this.collection.fields
			.filter((f) => f.type === 'relation')
			.map((f) => f.name)
			.join(',');
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
			const relation_fields = this.expand_string;

			if (relation_fields) query = { expand: relation_fields };

			try {
				const record = await this.#pocketbase
					.collection(this.collection.id)
					.getOne(record_id, query);
				this.current = { method: 'update', record };
			} catch (err) {
				return null;
			}
		}
	}

	open(editor: EditorTarget) {
		this.current = editor;
		this.draft_data = null;
		let url = page.url.href;
		url = url_query_param(url, 'editor', editor.method);
		url = url_query_param(url, 'record', editor.method == 'update' ? editor.record.id : null);
		goto(url, { replaceState: true });
	}

	close() {
		this.current = null;
		this.draft_data = null;
		let url = page.url.href;
		url = url_query_param(url, 'editor', null);
		url = url_query_param(url, 'record', null);
		goto(url, { replaceState: true });
	}

	// --- Draft Methods ---

	has_saved_draft(): string | null {
		if (!this.draft_key) return null;
		return localStorage.getItem(this.draft_key);
	}

	restore_draft(saved_str: string) {
		try {
			this.draft_data = JSON.parse(saved_str);
			return true;
		} catch (e) {
			this.clear_draft(); // Purge if corrupted
			return false;
		}
	}

	save_draft(data: Record<string, any>) {
		if (!this.draft_key) return;
		localStorage.setItem(this.draft_key, JSON.stringify(data));
	}

	clear_draft() {
		this.draft_data = null;
		if (this.draft_key) {
			localStorage.removeItem(this.draft_key);
		}
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
