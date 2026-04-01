import type { BookmarkTagGroupsRecord } from '$lib/pocketbase.types';

export type CountedBookmarkTagGroupsRecord = BookmarkTagGroupsRecord & {
	count: number;
};
