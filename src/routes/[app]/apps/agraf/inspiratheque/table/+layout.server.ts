// import type { ExpandedBookmarkFoldersRecord, ExpandedBookmarksRecord } from '../types';

// export async function load({ locals: { pocketbase }, depends }) {
// 	depends('data:bookmarks');

// 	const [bookmarks, folders]: [ExpandedBookmarksRecord[], ExpandedBookmarkFoldersRecord[]] =
// 		await Promise.all([
// 			pocketbase.collection('bookmarks').getFullList<ExpandedBookmarksRecord>({
// 				expand: 'tags,parent',
// 				sort: '-created'

// 				//fields: 'id,parent,title,url,favicon,tags,likes,created'
// 			}),
// 			pocketbase.collection('bookmark_folders').getFullList<ExpandedBookmarkFoldersRecord>({
// 				sort: 'title',
// 				fields: 'id,parent,title,description,collectionName'
// 			})
// 		]);

// 	return { bookmarks, folders };
// }
