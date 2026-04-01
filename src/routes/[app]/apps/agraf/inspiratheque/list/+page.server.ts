import type { PaginationResult } from '$lib/types';
import type { RecordListOptions } from 'pocketbase';
import type { ExpandedBookmarksRecord } from '../types';

export async function load({ locals: { pocketbase }, depends, url }) {
	depends('data:bookmarks');

	const options: RecordListOptions = {
		expand: 'tags,parent'
	};

	const sort = url.searchParams.get('sort');
	if (sort) options.sort = sort;

	const search = url.searchParams.get('search');
	if (search) options.filter = `title ~ '${search}'`;

	const page = Number(url.searchParams.get('sort')) || 1;

	const pagination_bookmarks: PaginationResult<ExpandedBookmarksRecord> = await pocketbase
		.collection('bookmarks')
		.getList(page, 64, options);

	return { pagination_bookmarks };
}
