<script lang="ts">
	import RecordPresentable from '$lib/components/record-presentable.svelte';

	const { row, name } = $props();

	const expanded = $derived(row?.expand?.[name]);

	let items = $derived(expanded ? (Array.isArray(expanded) ? expanded : [expanded]) : []);
</script>

<div class="flex flex-wrap gap-x-3 gap-y-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
	{#each items as item, i}
		<span class="underline- font-mono- bg-black/10 px-1 text-xs tracking-wide">
			<RecordPresentable record={item} />
			{i < items.length - 1 ? ', ' : ''}
		</span>
	{/each}
</div>
