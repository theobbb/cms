import { SvelteSet } from 'svelte/reactivity';
import { page } from '$app/state';
import { goto } from '$app/navigation';
import { url_query_param } from '$lib/utils/url';
import { use_pocketbase } from '$lib/pocketbase';
import { get_search_keys } from '$config/utils';
import type { CollectionField, CollectionModel, RecordListOptions, RecordModel } from 'pocketbase';

const PER_PAGE = 64;

export class CollectionList {
	// — Dependencies —
	private pocketbase = use_pocketbase();
	private collection: CollectionModel;
	private default_query: RecordListOptions;

	// — State —
	items: RecordModel[] = $state([]);
	total_items = $state(0);
	loaded_pages = $state(0);
	loading = $state(true);

	// — Checked rows —
	checked_set = new SvelteSet<string>();
	get all_checked() {
		return this.checked_set.size === this.items.length && this.items.length > 0;
	}
	get has_more() {
		return this.items.length < this.total_items;
	}

	// — Derived from URL —
	get search() {
		return page.url.searchParams.get('search') || '';
	}
	get sort() {
		return page.url.searchParams.get('sort') || this.collection.query?.sort || '';
	}
	get sort_param() {
		return page.url.searchParams.get('sort') || '';
	}

	// — Collection fields —
	get fields() {
		return this.collection.fields.filter((f) => !f.hidden && !f.editor_only);
	}
	get relation_fields() {
		return this.collection.fields
			.filter((f) => f.type === 'relation')
			.map((f) => f.name)
			.join(',');
	}

	constructor(collection: CollectionModel, default_query: RecordListOptions = {}) {
		this.collection = collection;
		this.default_query = default_query;

		// Reset and reload on search/sort change
		$effect(() => {
			this.search;
			this.sort;
			this.checked_set.clear();
			this.fetch_page(1);
		});

		// Realtime subscription
		$effect(() => {
			const unsub = this.pocketbase.collection(collection.id).subscribe('*', (event) => {
				if (event.action === 'create') {
					this.items = [event.record, ...this.items];
					this.total_items += 1;
				}
				if (event.action === 'update') {
					this.items = this.items.map((i) => (i.id === event.record.id ? event.record : i));
				}
				if (event.action === 'delete') {
					this.items = this.items.filter((i) => i.id !== event.record.id);
					this.total_items -= 1;
					this.checked_set.delete(event.record.id);
				}
			});

			return () => unsub.then((fn) => fn());
		});
	}

	// — Build query —
	private build_query(): RecordListOptions {
		const query = { ...this.default_query };

		if (this.sort) query.sort = this.sort;
		if (this.relation_fields) query.expand = this.relation_fields;

		const filters = [
			query.filter,
			this.search ? get_search_keys(this.search, this.collection.presentable_keys) : ''
		].filter(Boolean);

		query.filter = filters.join(' && ');

		return query;
	}

	// — Fetch a page and append —
	async fetch_page(page_num: number) {
		this.loading = true;
		try {
			const result = await this.pocketbase
				.collection(this.collection.name)
				.getList(page_num, PER_PAGE, this.build_query());

			this.items = page_num === 1 ? result.items : [...this.items, ...result.items];
			this.total_items = result.totalItems;
			this.loaded_pages = page_num;
		} finally {
			this.loading = false;
		}
	}

	// — Load more —
	load_more() {
		this.fetch_page(this.loaded_pages + 1);
	}

	// — Sorting —
	set_sort(field: CollectionField) {
		if (field.type === 'snippet') return;
		const key = String(field.name);
		const value = this.sort_param === field.name ? '-' + key : key;
		goto(url_query_param(page.url.href, 'sort', value));
	}

	// — Checkbox —
	toggle_check_head() {
		if (this.all_checked) {
			this.checked_set.clear();
		} else {
			this.items.forEach((row) => row.id && this.checked_set.add(row.id));
		}
	}

	toggle_check(id: string) {
		this.checked_set.has(id) ? this.checked_set.delete(id) : this.checked_set.add(id);
	}
}
