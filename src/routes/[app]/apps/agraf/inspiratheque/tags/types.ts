import type { BookmarkTagGroupsRecord, BookmarkTagsRecord } from '$lib/pocketbase.types';

export type ExpandedBookmarkTagsRecord = BookmarkTagsRecord & {
	expand: {
		parent: BookmarkTagGroupsRecord | null;
	};
};
