<script lang="ts">
	import type { BookmarkFoldersRecord } from '$lib/pocketbase.types';
	import DrawerForm from '$lib/ui/data-table/drawer/drawer-form.svelte';
	import type { FieldRelation } from '$lib/ui/data-table/drawer/field.types';
	import type { Snippet } from 'svelte';

	import type { ExpandedBookmarkFoldersRecord, ExpandedBookmarksRecord } from './types';
	import type { DrawerCtx } from '$lib/types';

	const { ctx, controls }: { ctx: DrawerCtx<ExpandedBookmarkFoldersRecord>; controls?: Snippet } =
		$props();
</script>

<DrawerForm
	fields={[
		{
			name: 'title',
			label: 'nom',
			type: 'string',
			required: true,
			min_length: 1,
			max_length: 100
		},
		{
			name: 'parent',
			label: 'parent',
			type: 'relation',
			collection: 'bookmark_folders',
			expand: ctx.target?.expand?.parent,
			display_key: 'title'
		} satisfies FieldRelation<ExpandedBookmarksRecord, BookmarkFoldersRecord>,
		{
			name: 'description',
			label: 'description',
			type: 'text',

			min_length: 1,
			max_length: 1
		}
	]}
	title="Dossier"
	collection="bookmark_folders"
	{controls}
	{ctx}
/>
