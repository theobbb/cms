<script lang="ts">
	import { set_collection } from '$lib/logic/ctx.svelte';
	import Table from './table.svelte';

	import { ColumnComponents } from './field.components';
	import Button from '../components/button.svelte';
	import type {
		CollectionField,
		CollectionModel,
		RecordListOptions,
		RecordModel
	} from 'pocketbase';
	import type { Snippet } from 'svelte';
	import { CollectionList } from './collection-list.svelte';

	const {
		collection,
		query,
		list = new CollectionList(collection, query),
		hidden = '',
		overrides = {},
		prefix_header,
		prefix_cell,
		row_props
	}: {
		collection: CollectionModel;
		query?: RecordListOptions;
		list?: CollectionList;
		hidden?: string | string[];
		overrides?: Record<string, Partial<CollectionField> & { snippet?: Snippet<[RecordModel]> }>;
		prefix_header?: Snippet;
		prefix_cell?: Snippet<[RecordModel]>;
		row_props?: (row: RecordModel) => Record<string, any>;
	} = $props();

	set_collection(collection);

	// 1. Parse the comma-separated string into an array of trimmed keys
	let hidden_keys = $derived(
		Array.isArray(hidden)
			? hidden
			: hidden
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
	);

	// 2. Filter out hidden columns, then merge any overrides (labels, snippets, etc.)
	let display_columns = $derived(
		list.fields
			.filter((field) => !hidden_keys.includes(field.name))
			.map((field) => {
				const override = overrides[field.name];
				return override ? { ...field, ...override } : field;
			})
	);
</script>

<Table
	columns={display_columns}
	items={list.items}
	sort_param={list.sort_param}
	onsort={(c) => list.set_sort(c)}
	{prefix_header}
	{prefix_cell}
	{row_props}
>
	{#snippet cell(row, column)}
		{@const type = column.type}
		{@const Component = ColumnComponents[type as keyof typeof ColumnComponents] ?? null}

		{#if column.snippet}
			{@render column.snippet(row)}
		{:else if Component}
			<Component {row} {...column} />
		{:else}
			Component {type} not found
		{/if}
	{/snippet}
</Table>

{#if list.has_more}
	<div class="my-gap-y">
		<Button onclick={() => list.load_more()} disabled={list.loading}>
			{list.loading ? 'Chargement...' : 'Charger plus'}
		</Button>
	</div>
{/if}
