import { page } from '$app/state';
import { use_pocketbase } from '$lib/pocketbase';
import type { PaginationResult } from '$lib/types';
import type { RecordListOptions } from 'pocketbase';
import { getContext, setContext } from 'svelte';

class DataStore {
	#chunks: Map<string, PaginationResult<any>> = $state(new Map());
	#pocketbase = use_pocketbase();

	async load_chunk(query: RecordListOptions, search_key: string) {
		const query = build_query();
		const result = await pocketbase.collection(collection.name).getList(page_num, per_page, query);

		if (append && pagination) {
			// Append new items to existing ones
			pagination = {
				...result,
				items: [...pagination.items, ...result.items]
			};
		} else {
			pagination = result;
		}
	}
}

function build_query(query: RecordListOptions, search_key: string = '') {
	// Handle sort
	const sort = page.url.searchParams.get('sort');
	if (sort) query.sort = sort;

	// Handle search
	const search = page.url.searchParams.get('search');
	const search_keys =
		search_key
			?.split(',')
			.map((k) => k.trim())
			.filter(Boolean) ?? [];

	if (search && search_keys.length) {
		const searchFilter = build_search_filter(search, search_keys);
		query.filter = query.filter ? `${query.filter} && ${searchFilter}` : searchFilter;
	}

	return query;
}
function build_search_filter(search: string, search_keys: string[]) {
	if (!search || !search_keys.length) return '';
	const escaped = search.replace(/'/g, "\\'");
	return `(${search_keys.map((k) => `${k} ~ '${escaped}'`).join(' || ')})`;
}

const DATA_KEY = Symbol('DATA_KEY');

export function set_data_store(): DataStore {
	const instance = new DataStore();
	setContext(DATA_KEY, instance);
	return instance;
}

export function get_data_store(): DataStore {
	return getContext<DataStore>(DATA_KEY);
}
