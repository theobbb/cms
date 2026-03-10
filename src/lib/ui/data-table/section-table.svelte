<script lang="ts">
	import Section from '$lib/components/section.svelte';
	import TableCollectionEditor from './table-collection-editor.svelte';
	import type { ComponentProps } from 'svelte';

	const props: Omit<ComponentProps<typeof TableCollectionEditor>, 'wrapper'> = $props();
</script>

<TableCollectionEditor {...props}>
	{#snippet wrapper({ header: cms_header, body: cms_body, footer: cms_footer })}
		<Section size="full">
			{#snippet header()}
				{@render cms_header()}
			{/snippet}

			<div class="-mx-md">{@render cms_body()}</div>

			{#snippet footer()}
				{@render cms_footer()}
			{/snippet}
		</Section>
	{/snippet}
</TableCollectionEditor>
