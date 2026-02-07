<script lang="ts">
	import { page } from '$app/state';
	import RecordName from '$lib/components/record-name.svelte';

	const { row, name } = $props();

	const expanded = $derived(row?.expand?.[name]);

	let items = $derived(expanded ? (Array.isArray(expanded) ? expanded : [expanded]) : []);

	const target_collection = $derived(page.data.collections[name]);
</script>

<div class="overflow-hidden text-ellipsis whitespace-nowrap">
	{#each items as item, i}
		<span class="underline">
			<RecordName record={item} collection={target_collection} />
			{i < items.length - 1 ? ', ' : ''}
		</span>
	{/each}
</div>
