<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import { EditorCollectionList } from '$lib/ui/data-table/collection-list.svelte';
	import { init_editor } from '$lib/ui/editor/editor-context.svelte';

	const { data } = $props();

	const list_items = new EditorCollectionList(data.collections.items);
	const list_types = new EditorCollectionList(data.collections.types);

	const editor_items = init_editor(data.collections.items);
	const editor_types = init_editor(data.collections.types);
</script>

<div class="grid grid-cols-4 gap-4">
	<div>
		<Button>Ajouter</Button>
		<div>
			{#each list_types.items as type}
				<div>
					{type.id}
				</div>
			{/each}
		</div>
	</div>
	<div>
		<Button>Ajouter</Button>
		{#each list_items.items as item}
			<div>
				{item.id}
			</div>
		{/each}
	</div>
</div>
