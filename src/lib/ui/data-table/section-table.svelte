<script lang="ts">
	import Section from '$lib/components/section.svelte';
	import TableCollectionEditor from './table-collection-editor.svelte';
	import type { CollectionModel, RecordListOptions } from 'pocketbase';
	import type { Snippet } from 'svelte';

	const props: {
		collection: CollectionModel;
		query?: RecordListOptions;
		action?: Snippet;
	} = $props();
</script>

<TableCollectionEditor {...props}>
	{#snippet wrapper({ header: cms_header, body: cms_body, footer: cms_footer })}
		<Section size="full">
			{#snippet header()}
				{@render cms_header()}
			{/snippet}

			{@render cms_body()}

			{#snippet footer()}
				{@render cms_footer()}
			{/snippet}
		</Section>
	{/snippet}
</TableCollectionEditor>
