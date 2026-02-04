import { resolve_query_params } from '$config/utils';
import type { PaginationResult } from '$lib/types';
import type { ServerLoadEvent } from '@sveltejs/kit';
import type { RecordListOptions } from 'pocketbase';

export async function get_list(
	{ locals: { pocketbase }, depends, url, params }: ServerLoadEvent,
	collection: string,
	args?: { query?: RecordListOptions; search_key?: string }
) {
	depends(`data:${collection}`);

	const query = { ...args?.query };

	if (query.filter) {
		query.filter = resolve_query_params(query.filter, params);
	}

	const sort = url.searchParams.get('sort');
	if (sort) query.sort = sort;

	const search = url.searchParams.get('search');
	const search_keys =
		args?.search_key
			?.split(',')
			.map((k) => k.trim())
			.filter(Boolean) ?? [];

	if (search && search_keys.length) {
		const searchFilter = build_search_filter(search, search_keys);
		query.filter = query.filter ? `${query.filter} && ${searchFilter}` : searchFilter;
	}

	const page = Number(url.searchParams.get('sort')) || 1;
	console.log(query);
	const res: PaginationResult<any> = await pocketbase
		.collection(collection)
		.getList(page, 64, query);

	return res;
}

function build_search_filter(search: string, keys: string[]) {
	const escaped = search.replace(/'/g, "\\'");
	return `(${keys.map((k) => `${k} ~ '${escaped}'`).join(' || ')})`;
}
