<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import Checkbox from './checkbox.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Button from '../button.svelte';
	import Search from '../form/search.svelte';
	import { ColumnComponents } from './field.components';
	import { url_query_param } from '$lib/utils/url';
	import { use_editor } from '$lib/logic/editor.svelte';

	import Editor from '../editor/editor.svelte';
	import { set_collection } from '$lib/logic/ctx.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import type { PaginationResult } from '$lib/types';
	import Section from '$lib/components/section.svelte';
	import { use_data_store } from '$lib/logic/data.svelte';
	import type { Snippet } from 'svelte';
	import type { CollectionModel } from 'pocketbase';

	const {
		collection,
		no_editor = false,
		header: outer_header
	}: { collection: CollectionModel; no_editor?: boolean; header?: Snippet } = $props();
	const id = $props.id();

	const pocketbase = use_pocketbase();
	const data_store = use_data_store();

	set_collection(collection);

	const current_search = $derived(page.url.searchParams.get('search') || '');
	const current_sort = $derived(page.url.searchParams.get('sort') || '');

	let pagination: PaginationResult<any> | null = $state(null);
	let current_page = $state(1);

	const editor = use_editor();

	async function fetch_data(page_num = 1) {
		// Fetch pages 1 through page_num and merge them
		const pages_to_fetch = Array.from({ length: page_num }, (_, i) => i + 1);

		pagination = await data_store.fetch_chunks(
			collection.name,
			pages_to_fetch,
			collection.query || {},
			collection.search_key || ''
		);

		current_page = page_num;

		checked_set.add(pagination.items[0].id);
		//await reopen_editor();
	}
	//$inspect(pagination?.items);
	async function load_more() {
		await fetch_data(current_page + 1);
	}

	async function reopen_editor() {
		const type = page.url.searchParams.get('editor');
		const record_id = page.url.searchParams.get('record');
		if (!type) return;

		if (type == 'create') {
			return editor.open({ type: 'create', collection });
		}
		if (!record_id) return;
		const record_exists = pagination?.items.find((item) => item.id == record_id);
		if (record_exists) return editor.open({ type: 'update', collection, record: record_exists });

		const record = await pocketbase.collection(collection.name).getOne(record_id, collection.query);
		editor.open({ type: 'update', collection, record });
	}

	let prev_search = $state('');
	let prev_sort = $state('');
	// Re-fetch when URL params change (search, sort)
	// $effect(() => {
	// 	const current_search = page.url.searchParams.get('search') || '';
	// 	const current_sort = page.url.searchParams.get('sort') || '';

	// 	// Only fetch if search or sort actually changed
	// 	if (current_search !== prev_search || current_sort !== prev_sort) {
	// 		prev_search = current_search;
	// 		prev_sort = current_sort;
	// 		current_page = 1; // Reset to page 1 on filter/sort change
	// 		fetch_data(1);
	// 	}
	// });
	$effect(() => {
		fetch_data(1);
	});
	const fields = $derived(collection.fields.filter((field) => !field.hidden && !field.editor_only));
	// const fields = $derived(
	// 	[...collection.fields].filter((field) => !field.hidden && field.name != 'id')
	// );

	const records = $derived(pagination?.items || []);
	const empty = $derived(!pagination?.items?.length);

	// Check if there are more pages to load
	const has_more = $derived(pagination && pagination.totalItems > pagination.items.length);

	const checked_set = new SvelteSet();

	const all_checked = $derived(checked_set.size == records.length && records.length > 0);

	const visible_columns = $derived(fields);

	const sort_param = $derived(page.url.searchParams.get('sort') || 'name');

	function on_toggle_check_head() {
		if (all_checked) {
			checked_set.clear();
			return;
		}
		records.forEach((row: any) => {
			if (!row.id) return;
			checked_set.add(row.id);
		});
	}

	function on_toggle_check(id: string) {
		if (checked_set.has(id)) {
			checked_set.delete(id);
		} else {
			checked_set.add(id);
		}
	}

	function set_sort(field: any) {
		const key = String(field.name);
		const value = sort_param == field.name ? '-' + key : key;

		const url = url_query_param(page.url.href, 'sort', value);
		goto(url);
	}
</script>

<Section size="full">
	{#snippet header()}
		<div class="flex justify-between">
			<div>{collection.name}</div>
			{#if outer_header}
				{@render outer_header()}
			{/if}
			{#if !no_editor}
				<Button onclick={() => editor.open({ type: 'create', collection })}>+ Nouveau</Button>
			{/if}
		</div>

		<div class="mt-2.5">
			<Search id="search-{id}" url_param="search" />
		</div>
	{/snippet}

	<div class="relative">
		<table class="-mx-gap- pr-gap- w-full">
			<thead class="bg-background sticky top-0 z-10">
				<tr class="">
					<th>
						<Checkbox checked={all_checked} ontoggle={on_toggle_check_head} />
					</th>
					{#each visible_columns as column}
						<th
							onclick={() => set_sort(column)}
							class="cursor-pointer text-left font-medium hover:bg-white/5"
						>
							<div class="flex items-center justify-between gap-2">
								<div>{column.name}</div>
								{#if sort_param == column.name}
									<div class="icon-[ri--arrow-up-line]"></div>
								{:else if sort_param == '-' + column.name}
									<div class="icon-[ri--arrow-down-line]"></div>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each records as row}
					<tr
						onclick={() => editor.open({ type: 'update', collection, record: row })}
						class={[
							'group border-b select-none first:border-t ',
							editor?.current?.type == 'update' && editor?.current?.record?.id == row.id
								? 'bg-accent'
								: 'hover:bg-accent/30',
							collection.name == 'users' && row.id == page.data.user.id && 'bg-accent'
						]}
					>
						<td>
							<Checkbox
								checked={checked_set.has(row.id)}
								ontoggle={() => on_toggle_check(row.id)}
							/>
						</td>
						{#each visible_columns as { type, snippet, ...field_props }}
							{@const Component = ColumnComponents[type]}
							<td class="">
								{#if type == 'snippet'}
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
		{#if has_more}
			<div class="text-right- my-gap-y"><Button onclick={load_more}>Charger plus</Button></div>
		{/if}
		{#if checked_set.size > 0}
			<div class="pointer-events-none absolute inset-0 flex items-end justify-center">
				<div class="sticky bottom-12">
					<div
						class="bg-surface text-surface-foreground pointer-events-auto w-sm px-3 py-2 shadow-lg"
					>
						<div class="flex items-center justify-between gap-2">
							<div class="flex items-center gap-2">
								<Button icon="icon-[ri--close-line]" size="sm" variant="ghost" />
								<div>{checked_set.size} séléctionné(s)</div>
							</div>
							<div>
								<Button>Supprimer</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	{#if records.length == 0}
		<div class="my-8 flex flex-col items-center justify-center">
			<div class="text-2">Aucun résultat.</div>
			<div class="text-2 mt-4"><Button size="lg">+ Nouveau</Button></div>
		</div>
	{/if}
	{#snippet footer()}
		<div class="flex items-center justify-between">
			<div>
				Total: {pagination?.totalItems || 0}
				{#if pagination && pagination.items.length < pagination.totalItems}
					(affichage {pagination.items.length})
				{/if}
			</div>
		</div>
	{/snippet}
</Section>

{#if !no_editor && editor.current && page.url.searchParams.has('editor')}
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
