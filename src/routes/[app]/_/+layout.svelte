<script lang="ts">
	import { page } from '$app/state';
	import { use_editor } from '$lib/logic/editor.svelte';
	import { set_params } from './ctx.svelte';
	import Section from './section.svelte';

	const { data, children } = $props();
	const editor = use_editor();

	set_params([page.params.app || '']);

	$inspect(data.schema_sections);
</script>

<div class="flex divide-x">
	<Section items={data.app.schema}></Section>
	<!-- {#if section[0].type == 'link'}
			<LayoutSection size="sm">
				<div class="space-y-0.5">
					{#each section as link}
						{#if link.type == 'link'}
							<Link {link} />
						{/if}
					{/each}
				</div>
			</LayoutSection>
		{:else if section[0].type == 'list'}
			<List collection={section[0].collection} />
		{:else if section[0].type == 'table'}
			<DataTable collection={section[0].collection} />
		{/if} -->
</div>

{@render children()}
