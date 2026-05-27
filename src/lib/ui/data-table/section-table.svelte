<script lang="ts">
	import Section from '$lib/components/section.svelte';
	import TableCollectionEditor from './table-collection-editor.svelte';
	import type { ComponentProps } from 'svelte';

	const props: Omit<ComponentProps<typeof TableCollectionEditor>, 'wrapper'> = $props();

	$inspect(props);
</script>

<TableCollectionEditor {...props}>
	{#snippet wrapper({ header: cms_header, body: cms_body })}
		<Section spacing_x={6}>
			{#snippet header()}
				{@render cms_header()}
			{/snippet}

			<div class="-mx-6">{@render cms_body()}</div>
		</Section>
	{/snippet}
</TableCollectionEditor>
