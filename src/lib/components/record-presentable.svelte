<script lang="ts">
	import type { CollectionModel, RecordModel } from 'pocketbase';

	const { record, collection }: { record: RecordModel; collection: CollectionModel } = $props();
</script>

{#if collection}
	<span>
		{#each collection.presentable_keys as key}
			<span class="first:hidden">, </span>
			{record[key]}
		{/each}
	</span>
{/if}
<!-- {#if collection.presentable_keys?.length}
	{#each collection.presentable_keys as key}
		{record[key]}
	{/each}
{:else}
	{record.name || record.title || record.first_name || record.id}
{/if} -->
