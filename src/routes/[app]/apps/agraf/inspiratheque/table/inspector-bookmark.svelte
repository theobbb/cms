<script lang="ts">
	import Md from '$lib/components/md.svelte';
	import type { Explorer } from '$lib/components/explorer/explorer.svelte';
	import type { ExpandedBookmarkFoldersRecord, ExpandedBookmarksRecord } from '../types';
	import InspectorLayout from '$lib/components/explorer/inspector-layout.svelte';
	import { pocketbase } from '$lib/pocketbase';
	import { push_toast } from '$lib/components/toaster/toaster-manager.svelte';

	import Badge from '$lib/ui/badge.svelte';
	import ToggleApprove from '../toggle-approve.svelte';
	import Comments from '$lib/components/comments/comments.svelte';

	const {
		explorer,
		inspecting
	}: {
		explorer: Explorer<ExpandedBookmarksRecord | ExpandedBookmarkFoldersRecord>;
		inspecting: ExpandedBookmarksRecord;
	} = $props();

	async function toggle_approved() {
		inspecting.approved = !inspecting.approved;
		await pocketbase
			.collection('bookmarks')
			.update(inspecting.id, { approved: inspecting.approved });

		push_toast('success', inspecting.approved ? 'Lien approuvé' : 'Lien désapprouvé');
	}
</script>

<InspectorLayout {explorer} {inspecting} title={inspecting.title} allow_edit={true}>
	{#snippet metadata()}
		<div>
			<Md md={inspecting.description} />
		</div>
	{/snippet}

	<div class="flex items-center gap-2">
		<div>
			{#if inspecting.favicon}
				<img src={pocketbase.files.getURL(inspecting, inspecting.favicon)} alt="favicon" />
			{/if}
		</div>
		<div class="markdown">
			<a target="_blank" href={inspecting.url}>
				{inspecting.url}
			</a>
		</div>
	</div>

	<ToggleApprove bookmark={inspecting} label />

	<div class="flex gap-1.5">
		{#each inspecting.expand.tags as tag}
			<Badge>{tag.name}</Badge>
		{/each}
	</div>
	{#if inspecting.screenshot}
		<div>
			<img src={pocketbase.files.getURL(inspecting, inspecting.screenshot)} alt="screenshot" />
		</div>
	{/if}
	<div class="mt-12">
		{#key inspecting.id}
			<Comments parent={inspecting.id} collection="bookmarks" parent_key="parent_bookmark" />
		{/key}
	</div>
</InspectorLayout>
