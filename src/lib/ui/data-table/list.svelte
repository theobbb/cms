<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import Checkbox from './checkbox.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import Button from '../button.svelte';
	import type { DrawerCtx, DrawerType, PaginationResult } from '$lib/types';
	import Search from '../form/search.svelte';
	import { ColumnComponents } from './field.components';
	import { url_query_param } from '$lib/utils/url';
	import Pagination from './pagination.svelte';
	import type { Collection } from '$config/types';
	import { use_editor } from '$lib/logic/editor.svelte';
	import LayoutSection from '../layouts/layout-section.svelte';

	const { collection }: { collection: Collection<{ id: string }> } = $props();
	const id = $props.id();

	const editor = use_editor();

	const pagination = $derived(collection.data);
	const fields = $derived(collection.fields);

	const records = $derived(pagination?.items || []);
	const empty = $derived(!pagination?.items?.length);

	// if (!updated_hidden && !columns.find((col: Column) => col.key == 'updated'))
	// 	columns.push({ key: 'updated', label: 'modifié', type: 'date' });
	// if (!created_hidden && !columns.find((col: Column) => col.key == 'created'))
	// 	columns.push({ key: 'created', label: 'créé', type: 'date' });

	const checked_set = new SvelteSet();

	const all_checked = $derived(checked_set.size == records.length && records.length);

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

	function set_sort(column) {
		const key = String(column.key);
		const value = sort_param == column.key ? '-' + key : key;

		const url = url_query_param(page.url.href, 'sort', value);
		goto(url);
	}
</script>

<LayoutSection size="lg">
	{#snippet header()}
		<div class="text-right">
			<Button onclick={() => editor.open({ type: 'create', collection })}>+ Nouveau</Button>
		</div>

		<div>
			<Search id="search-{id}" />
		</div>
	{/snippet}

	<table class="">
		<thead class="bg-bg sticky top-0 z-10">
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
					class="group border-b select-none first:border-t hover:bg-white/5"
				>
					<td>
						<Checkbox checked={checked_set.has(row.id)} ontoggle={() => on_toggle_check(row.id)} />
					</td>
					{#each visible_columns as { key, type = 'string', snippet }}
						<td class="">
							{#if snippet}
								{@render snippet(row)}
							{:else}
								{@const Component = ColumnComponents[type]}
								<Component {row} {key} />
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	{#snippet footer()}
		<div class="mt-4">
			<div>
				Total:
				{pagination?.totalItems}
			</div>
			{#if !empty}
				{#if pagination.totalItems > collection.data.perPage}
					<Pagination pagination={collection.data} />
				{/if}
			{/if}
		</div>
	{/snippet}
</LayoutSection>

<!-- {#if drawer.open && drawer_renderer}
	<Drawer onclose={close_editor}>
		{@render drawer_renderer(drawer)}
	</Drawer>
{/if} -->

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
