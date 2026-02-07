<script lang="ts">
	import type { App, Collection } from '$config/types';
	import Media from '$lib/components/media.svelte';
	import { get_app, get_collection } from '$lib/logic/ctx.svelte';
	import { pocketbase_file_url } from '$lib/utils/pocketbase';
	import { getContext } from 'svelte';

	const { row, name } = $props();

	const expand = $derived(row?.[name]);

	let items = $derived(expand ? (Array.isArray(expand) ? expand : [expand]) : []);

	const app = get_app();
	const collection = get_collection();
</script>

<div class="flex h-6 justify-start gap-1">
	{#each items as item, i (row.id + i)}
		<div class="aspect-square">
			<Media
				src={pocketbase_file_url(app.pocketbase.url, collection.name, row.id, item)}
				alt="item-{i}"
				thumbnail
			/>
		</div>
	{/each}
</div>
