import { page } from '$app/state';
import { use_pocketbase } from '$lib/pocketbase';
import type { PaginationResult } from '$lib/types';
import type { RecordListOptions } from 'pocketbase';
import { getContext, setContext } from 'svelte';

const PER_PAGE = 64;

interface ChunkKey {
	collection: string;
	query: RecordListOptions;
	page: number;
}

interface CachedData {
	result: PaginationResult<any>;
	timestamp: number;
}

class DataStore {
	#chunks: Map<string, CachedData> = $state(new Map());
	#pocketbase = use_pocketbase();
	#cache_duration = 5 * 60 * 1000; // 5 minutes cache

	/**
	 * Generate a cache key from collection name, query, and page number
	 */
	#get_cache_key(collection: string, query: RecordListOptions, page_num: number): string {
		// Create a stable key by stringifying query without search params
		const query_key = JSON.stringify({
			filter: query.filter || '',
			sort: query.sort || '',
			expand: query.expand || ''
		});
		return `${collection}:${query_key}:${page_num}`;
	}

	/**
	 * Check if cached data is still valid
	 */
	#is_cache_valid(cached: CachedData | undefined): boolean {
		if (!cached) return false;
		return Date.now() - cached.timestamp < this.#cache_duration;
	}

	/**
	 * Load a chunk of data with caching
	 */
	async load_chunk(
		collection: string,
		page_num: number,
		base_query: RecordListOptions,
		search_key: string = '',
		force_refresh = false
	): Promise<PaginationResult<any>> {
		const query = build_query(base_query, search_key);
		const cache_key = this.#get_cache_key(collection, query, page_num);

		// Check cache first
		if (!force_refresh) {
			const cached = this.#chunks.get(cache_key);
			if (this.#is_cache_valid(cached)) {
				return cached.result;
			}
		}

		// Fetch from server
		const result = await this.#pocketbase.collection(collection).getList(page_num, PER_PAGE, query);

		// Store in cache
		this.#chunks.set(cache_key, {
			result,
			timestamp: Date.now()
		});

		return result;
	}

	/**
	 * Load multiple chunks and merge them
	 */
	async load_chunks(
		collection: string,
		page_start: number,
		page_end: number,
		base_query: RecordListOptions,
		search_key: string = '',
		force_refresh = false
	): Promise<PaginationResult<any>> {
		const chunks = await Promise.all(
			Array.from({ length: page_end - page_start + 1 }, (_, i) =>
				this.load_chunk(collection, page_start + i, base_query, search_key, force_refresh)
			)
		);

		// Merge all chunks
		const all_items = chunks.flatMap((chunk) => chunk.items);

		// Use the last chunk's metadata
		const last_chunk = chunks[chunks.length - 1];

		return {
			...last_chunk,
			items: all_items,
			page: page_start,
			perPage: PER_PAGE
		};
	}

	/**
	 * Get accumulated data from page 1 to target page
	 */
	async get_accumulated_data(
		collection: string,
		target_page: number,
		base_query: RecordListOptions,
		search_key: string = '',
		force_refresh = false
	): Promise<PaginationResult<any>> {
		return this.load_chunks(collection, 1, target_page, base_query, search_key, force_refresh);
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
			total_chunks: this.#chunks.size,
			chunks: Array.from(this.#chunks.entries()).map(([key, data]) => ({
				key,
				items_count: data.result.items.length,
				age_ms: Date.now() - data.timestamp,
				valid: this.#is_cache_valid(data)
			}))
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
