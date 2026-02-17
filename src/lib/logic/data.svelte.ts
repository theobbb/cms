import { page } from '$app/state';
import { use_pocketbase } from '$lib/pocketbase';
import type { PaginationResult } from '$lib/types';
import type { RecordListOptions } from 'pocketbase';
import { getContext, setContext } from 'svelte';

const PER_PAGE = 64;

class DataStore {
	// Only cache first pages: Map<"collection:query", PaginationResult>
	#chunks: Map<string, PaginationResult<any>> = $state(new Map());
	#pocketbase = use_pocketbase();

	/**
	 * Generate cache key from collection and query (no page number)
	 */
	#get_cache_key(collection: string, query: RecordListOptions): string {
		const query_key = JSON.stringify({
			filter: query.filter || '',
			sort: query.sort || '',
			expand: query.expand || ''
		});
		return `${collection}:${query_key}`;
	}

	/**
	 * Fetch a single page (only page 1 is cached)
	 */
	async fetch_chunk(
		collection_name: string,
		page_num: number,
		base_query: RecordListOptions,
		search_key: string = ''
	): Promise<PaginationResult<any>> {
		const query = build_query(base_query, search_key);
		const cache_key = this.#get_cache_key(collection_name, query);

		// Only use cache for page 1
		if (page_num === 1) {
			const cached = this.#chunks.get(cache_key);
			if (cached) return cached;
		}

		const collection = page.data.collections[collection_name];

		const relations = collection.fields
			.filter((field) => field.type == 'relation')
			.map((field) => field.name)
			.join(',');
		//console.log(relations);
		const query_expanded = { ...query, expand: relations };

		// Fetch from server
		const result = await this.#pocketbase
			.collection(collection_name)
			.getList(page_num, PER_PAGE, query_expanded);
		console.log('fetching...', result?.items);
		// Only cache page 1
		if (page_num === 1) {
			this.#chunks.set(cache_key, result);
		}

		return result;
	}

	/**
	 * Fetch multiple pages and merge them (for "load more" functionality)
	 */
	async fetch_chunks(
		collection: string,
		pages: number[],
		base_query: RecordListOptions,
		search_key: string = ''
	): Promise<PaginationResult<any>> {
		const results = await Promise.all(
			pages.map((page_num) => this.fetch_chunk(collection, page_num, base_query, search_key))
		);

		// Merge all items
		const all_items = results.flatMap((result) => result.items);
		const last_result = results[results.length - 1];

		return {
			...last_result,
			items: all_items,
			page: pages[0],
			perPage: PER_PAGE
		};
	}

	/**
	 * Invalidate cache for a specific collection
	 */
	invalidate_collection(collection: string) {
		const keys_to_delete: string[] = [];
		for (const key of this.#chunks.keys()) {
			if (key.startsWith(`${collection}:`)) {
				keys_to_delete.push(key);
			}
		}
		keys_to_delete.forEach((key) => this.#chunks.delete(key));
		console.log('invalidate_collection...', collection);
	}

	/**
	 * Invalidate all cache
	 */
	invalidate_all() {
		this.#chunks.clear();
	}

	/**
	 * Get cache stats for debugging
	 */
	get_cache_stats() {
		return {
			total_cached: this.#chunks.size,
			keys: Array.from(this.#chunks.keys())
		};
	}
}

/**
 * Build query with search and sort from URL params
 */
function build_query(base_query: RecordListOptions, search_key: string = ''): RecordListOptions {
	const query = { ...base_query };

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

/**
 * Build search filter for PocketBase
 */
function build_search_filter(search: string, search_keys: string[]): string {
	if (!search || !search_keys.length) return '';
	const escaped = search.replace(/'/g, "\\'");
	return `(${search_keys.map((k) => `${k} ~ '${escaped}'`).join(' || ')})`;
}

const DATA_STORE_KEY = Symbol('DATA_STORE_KEY');

export function set_data_store(): DataStore {
	const instance = new DataStore();
	setContext(DATA_STORE_KEY, instance);
	return instance;
}

export function use_data_store(): DataStore {
	return getContext<DataStore>(DATA_STORE_KEY);
}
