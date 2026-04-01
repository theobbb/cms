import type { BookmarkTagGroupsRecord } from '$lib/pocketbase.types';
import { get_list } from '$lib/server/get-list';

export async function load(event) {
	const tag_groups_list = await get_list<BookmarkTagGroupsRecord>(event, 'bookmark_tag_groups', {
		search_key: 'name'
	});

	return { tag_groups_list };
	// depends('data:bookmark_tag_groups');
	// const tags: CountedBookmarkTagGroupsRecord[] = await pocketbase
	// 	.collection('bookmark_tag_groups')
	// 	.getFullList();

	// let tag_counts: BookmarkTagCountsRecord[] = await pocketbase
	// 	.collection('bookmark_tag_counts')
	// 	.getFullList();
	// const counts = Object.fromEntries(
	// 	tag_counts.map(({ id, bookmark_count }) => [id, bookmark_count])
	// );
	// tags.forEach((tag) => {
	// 	tag.count = counts[tag.id] || 0;
	// });

	// return { tags };
}
