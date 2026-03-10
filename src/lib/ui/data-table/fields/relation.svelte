<script lang="ts">
	import RecordPresentable from '$lib/components/record-presentable.svelte';
	import Reference from '$lib/ui/components/reference.svelte';

	const { row, name } = $props();

	const expanded = $derived(row?.expand?.[name]);

	let items = $derived(expanded ? (Array.isArray(expanded) ? expanded : [expanded]) : []);
</script>

<div class="flex flex-wrap gap-x-3 gap-y-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
	{#each items as item, i}
		<Reference>
			<RecordPresentable record={item} />
			<!-- {i < items.length - 1 ? ', ' : ''} -->
		</Reference>
	{/each}
</div>
