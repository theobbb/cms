<script lang="ts">
	import type { FieldProps } from '$config/field.types';
	import RecordName from '$lib/components/record-name.svelte';
	import { get_app } from '$lib/logic/ctx.svelte';

	const { row, key } = $props();
	const app = get_app();

	const expanded = $derived(row?.expand?.[key]);

	let items = $derived(expanded ? (Array.isArray(expanded) ? expanded : [expanded]) : []);

	const target_collection = $derived(app.collections[key]);
</script>

<div class="overflow-hidden text-ellipsis whitespace-nowrap">
	{#each items as item, i}
		<span class="underline">
			<RecordName record={item} collection={target_collection} />
			{i < items.length - 1 ? ', ' : ''}
		</span>
	{/each}
</div>
