<script lang="ts">
	import type { Branch } from '$config/types';
	import Link from './link.svelte';

	const { branch }: { branch: Branch } = $props();
</script>

<Link link={branch} />

<!-- <LayoutSection size="sm">

	{#each blocks as block}
		<div class="">
			{#if block.type == 'link'}
				<Link link={block} />
			{:else if block.type == 'list'}
				<List list={block} />
			{:else if block.type == 'table'}
				<Table table={block} />
			{/if}
		</div>
	{/each}

</LayoutSection> -->
