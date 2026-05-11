<script lang="ts">
	import { page } from '$app/state';
	import Section from '$lib/components/section.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte.js';
	import { EditorCollectionList } from '$lib/ui/data-table/collection-list.svelte';
	import TableHeader from '$lib/ui/data-table/table-header.svelte';
	import { init_editor } from '$lib/ui/editor/editor-context.svelte';
	import Editor from '$lib/ui/editor/editor.svelte';

	const { data } = $props();

	const collection = $derived(data.collections.posts);

	const list = new EditorCollectionList(collection, {});
	const editor = init_editor(collection);

	$inspect(list.items);

	const pop_edit = new Pop();
	$effect(() => {
		if (editor.current != null && page.url.searchParams.has('editor')) {
			pop_edit.show();
		}
	});
</script>

<div></div>
<Section size="full">
	<TableHeader title={collection.title || collection.name}>
		<Button onclick={() => editor.open({ method: 'create' })}>+ Nouveau</Button>
	</TableHeader>
	<div>
		{#each list.items as item}
			<div>
				{item.id}
			</div>
		{/each}
	</div>
</Section>

{#if editor.current != null && page.url.searchParams.has('editor')}
	<Dialog pop={pop_edit} onclose={editor.close}>
		<DialogHeader>
			<DialogTitle>Créer un post</DialogTitle>
		</DialogHeader>

		<!-- <div>type</div>
		<div class="">
			{#each ['image', 'video', ' audio', 'text'] as type}
				<div><button onclick={}>{type} →</button></div>
			{/each}
		</div> -->
	</Dialog>
{/if}
