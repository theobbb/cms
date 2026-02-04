<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import Checkbox from './checkbox.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Button from '../button.svelte';
	import Search from './search.svelte';
	import { ColumnComponents } from './column.types';
	import { url_query_param } from '$lib/utils/url';
	import type { Collection } from '$config/types';
	import { use_editor } from '$lib/logic/editor.svelte';

	import Editor from '../editor/editor.svelte';
	import { set_collection } from '$lib/logic/ctx.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import type { PaginationResult } from '$lib/types';
	import Section from '$lib/components/section.svelte';

	const { collection }: { collection: Collection<any> } = $props();
	const id = $props.id();

	const pocketbase = use_pocketbase();

	set_collection(collection);

	let pagination: PaginationResult<any> | null = $state(null);

	const editor = use_editor();
	//let editor: { type: 'create' } | { type: 'update'; record: any } | null = $state(null);

	async function fetch_data() {
		pagination = await pocketbase.collection(collection.name).getList(1, 64, collection.query);
		reopen_editor();
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

	$effect(() => {
		fetch_data();
	});

	const fields = $derived(collection.fields);

	const records = $derived(pagination?.items || []);
	const empty = $derived(!pagination?.items?.length);

	// if (!updated_hidden && !columns.find((col: Column) => col.key == 'updated'))
	// 	columns.push({ key: 'updated', label: 'modifié', type: 'date' });
	// if (!created_hidden && !columns.find((col: Column) => col.key == 'created'))
	// 	columns.push({ key: 'created', label: 'créé', type: 'date' });

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

	function set_sort(column: any) {
		const key = String(column.key);
		const value = sort_param == column.key ? '-' + key : key;

		const url = url_query_param(page.url.href, 'sort', value);
		goto(url);
	}
</script>

<Section size="lg">
	{#snippet header()}
		<div class="flex justify-between">
			<div>{collection.title}</div>
			<Button onclick={() => editor.open({ type: 'create', collection })}>+ Nouveau</Button>
		</div>

		<div>
			<Search id="search-{id}" />
		</div>
	{/snippet}

	<table class="-mx-gap- pr-gap- w-full">
		<thead class="sticky top-0 z-10 bg-bg">
			<tr class="">
				<th>
					<Checkbox checked={all_checked} ontoggle={on_toggle_check_head} />
				</th>
				{#each visible_columns as column}
					<th
						onclick={() => set_sort(column)}
						class="cursor-pointer text-left font-medium hover:bg-white/5"
					>
						{column.title}
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
							? 'bg-active'
							: 'hover:bg-active/30'
					]}
				>
					<td>
						<Checkbox checked={checked_set.has(row.id)} ontoggle={() => on_toggle_check(row.id)} />
					</td>
					{#each visible_columns as { key, type = 'string' }}
						{@const Component = ColumnComponents[type]}
						<td class="">
							<Component {row} {key} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	{#snippet footer()}
		<div class="">
			<div>
				Total:
				{pagination?.totalItems}
			</div>
			<!-- {#if !empty}
				{#if pagination.totalItems > collection.data.perPage}
					<Pagination pagination={collection.data} />
				{/if}
			{/if} -->
		</div>
	{/snippet}
</Section>
{#if editor.current && page.url.searchParams.has('editor')}
	<Editor editor={editor.current} />
{/if}

<style>
	td,
	th {
		user-select: none;
		cursor: pointer;
		padding: 0.2rem 0.8rem;
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
</style>
