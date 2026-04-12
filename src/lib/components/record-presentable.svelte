<script lang="ts">
	import { page } from '$app/state';
	import type { CollectionModel, RecordModel } from 'pocketbase';
	import RecordPresentable from './record-presentable.svelte';
	import { use_pocketbase } from '$lib/pocketbase';

	const { record }: { record: RecordModel } = $props();

	const pocketbase = use_pocketbase();

	const collection: CollectionModel | undefined = $derived(
		page.data.id_collections?.[record.collectionId]
	);

	async function load_relation(key: string) {
		if (!collection) return null;
		try {
			const relation = await pocketbase
				.collection(collection.field_map[key].collectionId)
				.getOne(record[key], { requestKey: null });

			return relation;
		} catch (_) {
			return null;
		}
	}
	// $inspect(record);
	/* TODO : Prevent fetch all individually → By either 1- Caching records if relation or 2- Emplement list options in fetching in Editor to expand sub-relations if they are part of presentable keys */
</script>

{#if collection}
	<span>
		{#each collection.presentable_keys as key}
			<span class="first:hidden">, </span>
			{#if collection.field_map[key].type == 'relation'}
				{#await load_relation(key) then relation}
					{#if relation}
						<RecordPresentable record={relation} />
					{/if}
				{/await}
			{:else}
				{record[key]}
			{/if}
		{/each}
	</span>
{/if}
