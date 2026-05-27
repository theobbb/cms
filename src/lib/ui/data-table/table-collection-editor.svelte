<script lang="ts">
	import TableCollection from './table-collection.svelte';
	import Editor, { type EditorFormActionContext } from '../editor/editor.svelte';
	import Button from '../components/button.svelte';
	import Checkbox from './checkbox.svelte';
	import type { CollectionModel, RecordListOptions } from 'pocketbase';
	import type { Snippet } from 'svelte';
	import { EditorCollectionList } from './collection-list.svelte';
	import TableHeader from './table-header.svelte';
	import { init_editor } from '../editor/editor-context.svelte';
	import { page } from '$app/state';

	const {
		collection,
		query,
		onsubmit,
		wrapper
	}: {
		collection: CollectionModel;
		query?: RecordListOptions;

		wrapper?: Snippet<[{ header: Snippet; body: Snippet }]>;
		onsubmit?: (ctx: EditorFormActionContext) => Promise<void | boolean>;
	} = $props();

	const list = new EditorCollectionList(collection, query);
	const editor = init_editor(collection);
</script>

{#snippet header()}
	<TableHeader title={collection.title || collection.name} {list} {editor} />
{/snippet}

{#snippet body()}
	<div class="relative">
		<TableCollection
			{collection}
			{query}
			{list}
			row_props={(row) => ({
				onclick: () => editor.open({ method: 'update', record: row }),
				class: [
					editor?.current?.method === 'update' &&
						editor?.current?.record?.id === row.id &&
						'bg-accent'
				],
				selected: editor?.current?.method === 'update' && editor?.current?.record?.id === row.id
			})}
		>
			{#snippet prefix_header()}
				<th class="checkbox">
					<Checkbox checked={list.all_checked} ontoggle={() => list.toggle_check_head()} />
				</th>
			{/snippet}
			{#snippet prefix_cell(row)}
				<td class="checkbox">
					<Checkbox
						checked={list.checked_set.has(row.id)}
						ontoggle={() => list.toggle_check(row.id)}
					/>
				</td>
			{/snippet}
		</TableCollection>

		{#if list.items.length === 0 && !list.loading}
			<div class="my-8 flex flex-col items-center justify-center">
				<div class="text-2">Aucun résultat.</div>
				<div class="text-2 mt-4">
					<Button size="lg" onclick={() => editor.open({ method: 'create' })}>+ Nouveau</Button>
				</div>
			</div>
		{/if}
	</div>
{/snippet}

{#if wrapper}
	{@render wrapper({ header, body })}
{:else}
	{@render header()}
	{@render body()}
{/if}

{#if editor.current != null && page.url.searchParams.has('editor')}
	<Editor {onsubmit} />
{/if}

<!-- {#if editor.target && page.url.searchParams.has('editor')}
	<Editor />
{/if} -->
