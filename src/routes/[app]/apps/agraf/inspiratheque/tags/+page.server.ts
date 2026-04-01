import type { BookmarkTagsRecord } from '$lib/pocketbase.types';
import type { BookmarkTagCountsRecord } from '$lib/pocketbase.types';
import { get_list } from '$lib/server/get-list';
import type { ExpandedBookmarkTagsRecord } from './types';

// export async function load({ locals: { pocketbase }, depends }) {
// 	depends('data:bookmark_tags');
// 	const tags: CountedBookmarkTagsRecord[] = await pocketbase
// 		.collection('bookmark_tags')
// 		.getFullList();

// 	let tag_counts: BookmarkTagCountsRecord[] = await pocketbase
// 		.collection('bookmark_tag_counts')
// 		.getFullList();
// 	const counts = Object.fromEntries(
// 		tag_counts.map(({ id, bookmark_count }) => [id, bookmark_count])
// 	);
// 	tags.forEach((tag) => {
// 		tag.count = counts[tag.id] || 0;
// 	});

// 	return { tags };
// }
export async function load(event) {
	const tags = await get_list<ExpandedBookmarkTagsRecord>(event, 'bookmark_tags', {
		options: {
			expand: 'parent'
		},
		search_key: 'name'
	});

	// let tag_counts: BookmarkTagCountsRecord[] = await event.locals.pocketbase
	// 	.collection('bookmark_tag_counts')
	// 	.getFullList();
	// const counts = Object.fromEntries(
	// 	tag_counts.map(({ id, bookmark_count }) => [id, bookmark_count])
	// );
	// tags.items.forEach((tag) => {
	// 	tag.count = counts[tag.id] || 0;
	// });

	return { tags };
	//return { tag_groups_list };
}
