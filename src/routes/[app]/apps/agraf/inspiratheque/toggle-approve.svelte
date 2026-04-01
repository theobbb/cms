<script lang="ts">
	import { push_toast } from '$lib/components/toaster/toaster-manager.svelte';
	import { pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import IconToggleFalse from '$lib/ui/icons/icon-toggle-false.svelte';
	import IconToggleTrue from '$lib/ui/icons/icon-toggle-true.svelte';
	import type { ExpandedBookmarksRecord } from './types';

	const { bookmark, label = false }: { bookmark: ExpandedBookmarksRecord; label?: boolean } =
		$props();

	const id = $props.id();

	async function toggle() {
		bookmark.approved = !bookmark.approved;
		await pocketbase.collection('bookmarks').update(bookmark.id, { approved: bookmark.approved });

		push_toast('success', bookmark.approved ? 'Lien approuvé' : 'Lien désapprouvé');
	}
</script>

<div class="flex items-center gap-2">
	<Button icon variant="none" id="approved-toggle-{id}" onclick={toggle}>
		<div class="text-3xl">
			{#if bookmark.approved}
				<IconToggleTrue />
			{:else}
				<IconToggleFalse />
			{/if}
		</div>
	</Button>

	{#if label}
		<label class="select-none" for="approved-toggle-{id}">Approuvé</label>
	{/if}
</div>
