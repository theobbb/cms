<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import Checkbox from './checkbox.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Button from '../button.svelte';
	import Search from '../form/search.svelte';
	import { ColumnComponents } from './field.components';
	import { url_query_param } from '$lib/utils/url';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte';
	import Editor from '../editor/editor.svelte';
	import { set_collection } from '$lib/logic/ctx.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Section from '$lib/components/section.svelte';
	import type {
		CollectionField,
		CollectionModel,
		RecordListOptions,
		RecordModel
	} from 'pocketbase';
	import { get_search_keys } from '$config/utils';

	const PER_PAGE = 64;
	//test
	const {
		collection,
		query: default_query,
		no_editor = false
	}: { collection: CollectionModel; query?: RecordListOptions; no_editor?: boolean } = $props();

	const pocketbase = use_pocketbase();
	const editor = use_editor();

	set_collection(collection);

	// — State —
	let items: RecordModel[] = $state([]);
	let total_items = $state(0);
	let loaded_pages = $state(0);
	let loading = $state(true);

	// — Derived from URL —
	const search = $derived(page.url.searchParams.get('search') || '');
	const sort = $derived(page.url.searchParams.get('sort') || collection.query?.sort || '');

	// — Collection fields —
	const fields = $derived(collection.fields.filter((f) => !f.hidden && !f.editor_only));
	const relation_fields = $derived(
		collection.fields
			.filter((f) => f.type === 'relation')
			.map((f) => f.name)
			.join(',')
	);

	// — Checked rows —
	const checked_set = new SvelteSet<string>();
	const all_checked = $derived(checked_set.size === items.length && items.length > 0);
	const has_more = $derived(items.length < total_items);

	// — Build query —
	function build_query() {
		//const query = { ...collection.query };
		const query = { ...default_query };

		if (sort) query.sort = sort;
		if (relation_fields) query.expand = relation_fields;

		const filters = [
			query.filter,
			search ? get_search_keys(search, collection.presentable_keys) : ''
		].filter(Boolean);

		query.filter = filters.join(' && ');

		// Search filter

		return query;
	}

	// — Fetch a page and append —
	async function fetch_page(page_num: number) {
		loading = true;
		try {
			const result = await pocketbase
				.collection(collection.name)
				.getList(page_num, PER_PAGE, build_query());

			if (page_num === 1) {
				items = result.items;
			} else {
				items = [...items, ...result.items];
			}

			total_items = result.totalItems;
			loaded_pages = page_num;
		} finally {
			loading = false;
		}
	}

	// — Reset and reload on search/sort change —
	$effect(() => {
		// Track search and sort reactively
		search;
		sort;
		checked_set.clear();
		fetch_page(1);
	});

	// — Load more —
	function load_more() {
		fetch_page(loaded_pages + 1);
	}

	// — Realtime subscription —
	$effect(() => {
		const unsub = pocketbase.collection(collection.id).subscribe('*', (event) => {
			if (event.action === 'create') {
				items = [event.record, ...items];
				total_items += 1;
			}
			if (event.action === 'update') {
				items = items.map((i) => (i.id === event.record.id ? event.record : i));
			}
			if (event.action === 'delete') {
				items = items.filter((i) => i.id !== event.record.id);
				total_items -= 1;
				checked_set.delete(event.record.id);
			}
		});

		return () => unsub.then((fn) => fn());
	});

	// — Sorting —
	const sort_param = $derived(page.url.searchParams.get('sort') || '');

	function set_sort(field: CollectionField) {
		if (field.type == 'snippet') return;
		const key = String(field.name);
		const value = sort_param === field.name ? '-' + key : key;
		goto(url_query_param(page.url.href, 'sort', value));
	}

	// — Checkbox —
	function on_toggle_check_head() {
		if (all_checked) {
			checked_set.clear();
		} else {
			items.forEach((row) => row.id && checked_set.add(row.id));
		}
	}

	function on_toggle_check(id: string) {
		checked_set.has(id) ? checked_set.delete(id) : checked_set.add(id);
	}
</script>

<Section size="full">
	{#snippet header()}
		<div class="grid grid-cols-[auto_1fr_auto] items-center gap-8">
			<div class="capitalize">{collection.name}</div>
			<div class="w-full"><Search url_param="search" /></div>
			{#if !no_editor}
				<Button onclick={() => editor.open({ type: 'create', collection })}>+ Nouveau</Button>
			{/if}
		</div>
	{/snippet}

	<div class="relative">
		<table class="-mx-gap- pr-gap- w-full">
			<thead class="bg-background sticky top-0 z-10">
				<tr>
					<th><Checkbox checked={all_checked} ontoggle={on_toggle_check_head} /></th>
					{#each fields as column}
						<th
							onclick={() => set_sort(column)}
							class="cursor-pointer text-left font-medium hover:bg-white/5"
						>
							<div class="flex items-center justify-between gap-2">
								<div>{column.name}</div>
								{#if sort_param === column.name}
									<div class="icon-[ri--arrow-up-line]"></div>
								{:else if sort_param === '-' + column.name}
									<div class="icon-[ri--arrow-down-line]"></div>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each items as row}
					<tr
						onclick={() => editor.open({ type: 'update', collection, record: row })}
						class={[
							'group border-b select-none first:border-t',
							editor?.current?.type === 'update' && editor?.current?.record?.id === row.id
								? 'bg-accent'
								: 'hover:bg-accent/30',
							collection.name === 'users' && row.id === page.data.user?.id && 'bg-accent'
						]}
					>
						<td>
							<Checkbox
								checked={checked_set.has(row.id)}
								ontoggle={() => on_toggle_check(row.id)}
							/>
						</td>
						{#each fields as { type, snippet, ...field_props }}
							{@const Component = ColumnComponents[type]}
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

		{#if has_more}
			<div class="my-gap-y">
				<Button onclick={load_more} disabled={loading}>
					{loading ? 'Chargement...' : 'Charger plus'}
				</Button>
			</div>
		{/if}

		{#if checked_set.size > 0}
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
									onclick={() => checked_set.clear()}
								/>
								<div>{checked_set.size} séléctionné(s)</div>
							</div>
							<Button>Supprimer</Button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if items.length === 0 && !loading}
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
				Total: {total_items}
				{#if items.length < total_items}
					(affichage {items.length})
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
