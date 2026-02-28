<script lang="ts">
	import Checkbox from './checkbox.svelte';
	import { page } from '$app/state';
	import Button from '../button.svelte';
	import Search from '../form/search.svelte';
	import { ColumnComponents } from './field.components';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte';
	import Editor from '../editor/editor.svelte';
	import { set_collection } from '$lib/logic/ctx.svelte';
	import Section from '$lib/components/section.svelte';
	import type { CollectionModel, RecordListOptions } from 'pocketbase';
	import { CollectionList } from '$lib/logic/collection-list.svelte';
	import type { Snippet } from 'svelte';

	const {
		collection,
		query: default_query,
		editor_mode = true,
		action: snippet_action
	}: {
		collection: CollectionModel;
		query?: RecordListOptions;
		editor_mode?: boolean;
		action?: Snippet;
	} = $props();

	const editor = use_editor();
	set_collection(collection);

	const list = new CollectionList(collection, default_query);
</script>

<Section size="full">
	{#snippet header()}
		<div class="grid grid-cols-[auto_1fr_auto] items-center gap-8">
			<div class="capitalize">{collection.name}</div>
			<div class="w-full"><Search url_param="search" /></div>
			{#if editor_mode}
				<Button onclick={() => editor.open({ type: 'create', collection })}>+ Nouveau</Button>
			{/if}
			{@render snippet_action?.()}
		</div>
	{/snippet}

	<div class="relative">
		<table class="w-full">
			<thead class="bg-background sticky top-0 z-10">
				<tr>
					<th><Checkbox checked={list.all_checked} ontoggle={() => list.toggle_check_head()} /></th>
					{#each list.fields as column}
						<th onclick={() => list.set_sort(column)} class="cursor-pointer text-left">
							<div
								class="text-foreground-muted flex items-center justify-between gap-2 text-sm font-normal"
							>
								<div>{column.name}</div>
								{#if list.sort_param === column.name}
									<div class="icon-[ri--arrow-up-line]"></div>
								{:else if list.sort_param === '-' + column.name}
									<div class="icon-[ri--arrow-down-line]"></div>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each list.items as row}
					<tr
						onclick={() => editor.open({ type: 'update', collection, record: row })}
						class={[
							'group border-b select-none first:border-t',
							editor?.current?.type === 'update' && editor?.current?.record?.id === row.id
								? 'bg-accent'
								: editor_mode && 'hover:bg-accent/30',
							collection.name === 'users' && row.id === page.data.user?.id && 'bg-accent'
						]}
					>
						<td>
							<Checkbox
								checked={list.checked_set.has(row.id)}
								ontoggle={() => list.toggle_check(row.id)}
							/>
						</td>
						{#each list.fields as { type, snippet, ...field_props }}
							{@const Component = ColumnComponents[type as keyof typeof ColumnComponents] ?? null}
							<td>
								{#if type === 'snippet'}
									{@render snippet(row)}
								{:else if Component}
									<Component {row} {...field_props} />
								{:else}
									Component {type} not found
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>

		{#if list.has_more}
			<div class="my-gap-y">
				<Button onclick={() => list.load_more()} disabled={list.loading}>
					{list.loading ? 'Chargement...' : 'Charger plus'}
				</Button>
			</div>
		{/if}

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
	</div>

	{#if list.items.length === 0 && !list.loading}
		<div class="my-8 flex flex-col items-center justify-center">
			<div class="text-2">Aucun résultat.</div>
			<div class="text-2 mt-4">
				<Button size="lg" onclick={() => editor.open({ type: 'create', collection })}>
					+ Nouveau
				</Button>
			</div>
		</div>
	{/if}

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
</Section>

{#if editor_mode && editor.current && page.url.searchParams.has('editor')}
	<Editor editor={editor.current} />
{/if}

<style>
	td,
	th {
		user-select: none;
		cursor: pointer;
		padding: 0.25rem 0.8rem;
		max-width: 10rem;
	}
	td:first-child,
	th:first-child {
		width: 1rem;
	}
	th:not(:first-child):hover {
		box-shadow: inset 0 -2px 0 currentColor;
	}
	tbody tr:hover {
		box-shadow: inset -2px 0 0 currentColor;
	}
	thead tr {
		box-shadow: inset 0 -1px 0 currentColor;
	}
</style>
