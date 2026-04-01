<script lang="ts">
	import type { Explorer } from '$lib/components/explorer/explorer.svelte';
	import type { ExpandedBookmarkFoldersRecord, ExpandedBookmarksRecord } from '../types';
	import InspectorLayout from '$lib/components/explorer/inspector-layout.svelte';

	const {
		explorer,
		inspecting,
		new_sub_item
	}: {
		explorer: Explorer<ExpandedBookmarksRecord | ExpandedBookmarkFoldersRecord>;
		inspecting: ExpandedBookmarkFoldersRecord;
		new_sub_item: (type: string) => void;
	} = $props();
</script>

<InspectorLayout
	{explorer}
	{inspecting}
	title={inspecting.title}
	allow_edit={true}
	create_buttons={[
		{ text: 'Lien', action: () => new_sub_item('bookmark') },
		{ text: 'Dossier', action: () => new_sub_item('folder') }
	]}
>
	{#snippet metadata()}
		<div class="relative">metadata</div>
	{/snippet}
</InspectorLayout>
