<script lang="ts">
	import { page } from '$app/state';
	import type { TreeItem } from '$config/types';
	import { is_leaf } from '$config/utils';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import LayoutSection from '$lib/ui/layouts/layout-section.svelte';
	import { get_params } from './ctx.svelte';
	import Link from './link.svelte';
	import Section from './section.svelte';

	const { items }: { items: TreeItem[] } = $props();

	const parent_params = get_params();
	const parent_path = parent_params.join('/');

	const trailing_param = $derived(page.params.schema?.split('/').pop());

	const next_section = $derived(items.find((item) => item.param == trailing_param));

	$inspect(next_section);
</script>

<LayoutSection size="sm">
	<div class="space-y-0.5">
		{#each items as item}
			<Link {item} />
		{/each}
	</div>
	<!-- {#each blocks as block}
		<div class="">
			{#if block.type == 'link'}
				<Link link={block} />
			{:else if block.type == 'list'}
				<List list={block} />
			{:else if block.type == 'table'}
				<Table table={block} />
			{/if}
		</div>
	{/each} -->
</LayoutSection>

<!-- {#if next_section}
	{#if is_leaf(next_section)}
		<DataTable collection={next_section.collection} />
	{:else}
		<Section items={next_section.children} />
	{/if}
{/if} -->
<!-- {#if is_branch(item)}
				<Link item={item} />
			{:else}
				<Leaf leaf={item} />
			{/if} -->
