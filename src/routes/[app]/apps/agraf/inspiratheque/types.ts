import type {
	BookmarkFoldersRecord,
	BookmarksRecord,
	BookmarkTagsRecord
} from '$lib/pocketbase.types';

export type ExpandedBookmarksRecord = BookmarksRecord & {
	expand: {
		tags: BookmarkTagsRecord[];
		parent: BookmarkFoldersRecord | null;
	};
	collectionName: 'bookmarks';
};
export type ExpandedBookmarkFoldersRecord = BookmarkFoldersRecord & {
	expand: {
		parent: BookmarkFoldersRecord | null;
	};
	collectionName: 'bookmark_records';
};
