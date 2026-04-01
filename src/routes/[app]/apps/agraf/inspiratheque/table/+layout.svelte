<script lang="ts">
	import Breadcrumbs from '$lib/components/explorer/breadcrumbs.svelte';
	import { create_explorer } from '$lib/components/explorer/explorer.svelte.js';
	import Table from '$lib/components/explorer/table.svelte';
	import ExplorerLayout from '$lib/components/explorer/explorer-layout.svelte';
	import type { ExpandedBookmarkFoldersRecord, ExpandedBookmarksRecord } from '../types';
	import InspectorBookmark from './inspector-bookmark.svelte';
	import InspectorFolder from './inspector-folder.svelte';
	import IconLink from '$lib/ui/icons/icon-link.svelte';
	import IconFolder from '$lib/ui/icons/icon-folder.svelte';
	import DrawerBookmark from '../drawer-bookmark.svelte';
	import DrawerFolder from '../drawer-folder.svelte';
	import Button from '$lib/ui/button.svelte';
	import { pocketbase } from '$lib/pocketbase';
	import { page } from '$app/state';
	import Comments from '$lib/components/comments/comments.svelte';
	import { onMount } from 'svelte';
	import {
		realtime_comments_subscribe,
		realtime_comments_unsubscribe
	} from '$lib/cache/cache-comments.svelte';

	const { data } = $props();

	const { bookmarks, folders } = data;

	let view: 'all' | 'not_approved' = $state('all');

	const not_approved = $derived(bookmarks.filter((bookmark) => !bookmark.approved));

	const items: (ExpandedBookmarksRecord | ExpandedBookmarkFoldersRecord)[] = [
		...bookmarks,
		...folders
	];

	const explorer = create_explorer<ExpandedBookmarksRecord | ExpandedBookmarkFoldersRecord>(
		items,
		'/cms/pages/inspiratheque/table',
		[
			{
				collection: 'bookmarks',
				options: { expand: 'parent,tags' }
			},
			{
				collection: 'bookmark_folders',
				options: { expand: 'parent' }
			}
		]
	);
	const { breadcrumbs, inspecting, inspector, drawer_ctx } = $derived(explorer);

	type EditorType = 'folder' | 'bookmark';
	let creating_type: EditorType = $state('bookmark');

	function new_sub_item(type: EditorType) {
		if (!inspecting) return;
		creating_type = type;
		explorer.actions.new_sub_item(inspecting);
	}

	function is_bookmark(
		item: ExpandedBookmarksRecord | ExpandedBookmarkFoldersRecord
	): item is ExpandedBookmarksRecord {
		return 'url' in item;
	}

	onMount(() => {
		realtime_comments_subscribe('bookmarks');
		return () => {
			realtime_comments_unsubscribe('bookmarks');
		};
	});
</script>

<ExplorerLayout n_nav={2}>
	{#snippet header()}
		<div class="flex justify-between gap-6"></div>

		<Breadcrumbs {breadcrumbs} collection="folders" />
	{/snippet}
	{#snippet table()}
		<Table {explorer}>
			{#snippet icon(item: ExpandedBookmarksRecord | ExpandedBookmarkFoldersRecord)}
				{#if is_bookmark(item)}
					{@const src = pocketbase.files.getURL(item, item.favicon)}
					{#if src}
						<div>
							<img alt="favicon" class="size-[16px]" {src} />
						</div>
					{:else}
						<div class="opacity-60"><IconLink /></div>
					{/if}
				{:else}
					<div class="opacity-60"><IconFolder /></div>
				{/if}
			{/snippet}
		</Table>
	{/snippet}
	{#snippet drawer()}
		{#if inspector.mode == 'inspect'}
			{#if inspecting}
				{#if is_bookmark(inspecting)}
					<InspectorBookmark {explorer} {inspecting} />
				{:else}
					<InspectorFolder {explorer} {inspecting} {new_sub_item} />
				{/if}
			{/if}
		{:else if inspector.mode == 'edit'}
			{#if is_bookmark(inspector.target)}
				<DrawerBookmark ctx={drawer_ctx} />
			{:else}
				<DrawerFolder ctx={drawer_ctx} />
			{/if}
		{:else if inspector.mode == 'create'}
			{#if creating_type == 'bookmark'}
				<DrawerBookmark ctx={drawer_ctx} controls={drawer_controls} />
			{:else}
				<DrawerFolder ctx={drawer_ctx} controls={drawer_controls} />
			{/if}
		{/if}
	{/snippet}
</ExplorerLayout>

{#snippet drawer_controls()}
	<div class="flex gap-1">
		<Button
			variant={creating_type == 'bookmark' ? 'action' : 'ghost'}
			icon
			onclick={() => (creating_type = 'bookmark')}
		>
			<IconLink />
		</Button>
		<Button
			variant={creating_type == 'folder' ? 'action' : 'ghost'}
			icon
			onclick={() => (creating_type = 'folder')}
		>
			<IconFolder />
		</Button>
	</div>
{/snippet}
