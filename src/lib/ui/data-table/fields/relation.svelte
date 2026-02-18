<script lang="ts">
	import { page } from '$app/state';
	import RecordName from '$lib/components/record-name.svelte';
	import RecordPresentable from '$lib/components/record-presentable.svelte';

	const { row, name, collectionId } = $props();

	const expanded = $derived(row?.expand?.[name]);

	let items = $derived(expanded ? (Array.isArray(expanded) ? expanded : [expanded]) : []);

	const target_collection = $derived(page.data.id_collections[collectionId]);
</script>

<div class="overflow-hidden text-ellipsis whitespace-nowrap">
	{#each items as item, i}
		<span class="underline">
			<RecordPresentable record={item} collection={target_collection} />
			{i < items.length - 1 ? ', ' : ''}
		</span>
	{/each}
</div>
