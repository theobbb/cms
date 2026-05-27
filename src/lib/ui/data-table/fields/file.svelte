<script lang="ts">
	import Media from '$lib/components/media.svelte';
	import { get_app, get_collection } from '$lib/logic/ctx.svelte';
	import { pocketbase_file_url } from '$lib/utils/pocketbase';

	const { row, name } = $props();

	const expand = $derived(row?.[name]);

	const items = $derived(expand ? (Array.isArray(expand) ? expand : [expand]) : []);
	const visible_items = $derived(items.slice(0, 3));

	const app = get_app();
	const collection = get_collection();
</script>

<div class="flex justify-start gap-1.5">
	{#each visible_items as item, i (row.id + i)}
		<div class="aspect-square h-12">
			<Media
				src={pocketbase_file_url(app.pocketbase.url, collection.name, row.id, item)}
				alt="item-{i}"
				thumbnail
			/>
		</div>
	{/each}
	{#if items.length > visible_items.length}
		<div class="aspect-square h-12 border">
			<div class="flex h-full w-full items-center justify-center text-sm text-muted">
				+{items.length - visible_items.length}
			</div>
		</div>
	{/if}
</div>
