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

		wrapper?: Snippet<[{ header: Snippet; body: Snippet; footer: Snippet }]>;
		onsubmit?: (ctx: EditorFormActionContext) => Promise<void | boolean>;
	} = $props();

	const list = new EditorCollectionList(collection, query);
	const editor = init_editor(collection);
</script>

{#snippet header()}
	<TableHeader title={collection.title || collection.name}>
		<Button onclick={() => editor.open({ method: 'create' })}>+ Nouveau</Button>
	</TableHeader>
{/snippet}

{#snippet footer()}
	<div class="flex items-center justify-between">
		<div>
			Total: {list.total_items}
			{#if list.items.length < list.total_items}
				(affichage {list.items.length})
			{/if}
		</div>
	</div>
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
					'group border-b select-none first:border-t hover:bg-accent/30',
					editor?.current?.method === 'update' &&
						editor?.current?.record?.id === row.id &&
						'bg-accent'
				]
			})}
		>
			{#snippet prefix_header()}
				<th>
					<Checkbox checked={list.all_checked} ontoggle={() => list.toggle_check_head()} />
				</th>
			{/snippet}
			{#snippet prefix_cell(row)}
				<td>
					<Checkbox
						checked={list.checked_set.has(row.id)}
						ontoggle={() => list.toggle_check(row.id)}
					/>
				</td>
			{/snippet}
		</TableCollection>

		{#if list.checked_set.size > 0}
			<div class="pointer-events-none absolute inset-0 flex items-end justify-center">
				<div class="sticky bottom-12">
					<div
						class="bg-surface text-surface-foreground pointer-events-auto w-sm px-3 py-2 shadow-lg"
					>
						<div class="flex items-center justify-between gap-2">
							<div class="flex items-center gap-2">
								<Button
									icon="icon-[ri--close-line]"
									size="sm"
									variant="ghost"
									onclick={() => list.checked_set.clear()}
								/>
								<div>{list.checked_set.size} séléctionné(s)</div>
							</div>
							<Button>Supprimer</Button>
						</div>
					</div>
				</div>
			</div>
		{/if}

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
	{@render wrapper({ header, body, footer })}
{:else}
	{@render header()}
	{@render body()}
	{@render footer()}
{/if}

{#if editor.current != null && page.url.searchParams.has('editor')}
	<Editor {onsubmit} />
{/if}
<!-- {#if editor.target && page.url.searchParams.has('editor')}
	<Editor />
{/if} -->
