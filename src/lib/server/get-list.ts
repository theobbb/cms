import type { CollectionRecords } from '$lib/pocketbase.types';
import type { PaginationResult } from '$lib/types';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { RecordListOptions } from 'pocketbase';

export async function get_list<T>(
	{ locals: { pocketbase }, depends, url }: ServerLoadEvent,
	collection: keyof CollectionRecords,
	args?: { options?: RecordListOptions; search_key?: string }
) {
	depends(`data:${collection}`);

	const options = args?.options ?? {};

	const sort = url.searchParams.get('sort');
	if (sort) options.sort = sort;

	const search = url.searchParams.get('search');

	const search_keys =
		args?.search_key
			?.split(',')
			.map((k) => k.trim())
			.filter(Boolean) ?? [];

	if (search && search_keys.length) {
		const searchFilter = build_search_filter(search, search_keys);
		options.filter = options.filter ? `${options.filter} && ${searchFilter}` : searchFilter;
	}

	const page = Number(url.searchParams.get('sort')) || 1;
	console.log(options);
	const res: PaginationResult<T> = await pocketbase
		.collection(collection)
		.getList(page, 64, options);

	return res;
}

function build_search_filter(search: string, keys: string[]) {
	const escaped = search.replace(/'/g, "\\'");
	return `(${keys.map((k) => `${k} ~ '${escaped}'`).join(' || ')})`;
}
