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
	import { FIELD_ICONS } from '../components/field-icons';

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
		overrides?: Record<string, Partial<CollectionField>>;
		prefix_header?: Snippet;
		prefix_cell?: Snippet<[RecordModel]>;
		row_props?: (row: RecordModel) => Record<string, any>;
	} = $props();

	const columns = $derived(
		collection.fields
			.filter((f) => !f.hidden)
			.map((f) => {
				if (f.type == 'autodate') f.icon = FIELD_ICONS.date;
				else f.icon = FIELD_ICONS[f.type as keyof typeof ColumnComponents];
				return f;
			})
	);
</script>

<Table
	{columns}
	items={list.items}
	sort_param={list.sort_param}
	onsort={(c) => list.set_sort(c)}
	{prefix_header}
	{prefix_cell}
	{row_props}
>
	{#snippet cell(row, column)}
		{@const type = column.type as keyof typeof ColumnComponents}
		{@const Component = ColumnComponents[type] ?? null}

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
	<div class="mx-2x my-3x">
		<Button size="lg" onclick={() => list.load_more()} disabled={list.loading}>
			{list.loading ? 'Chargement...' : 'Charger +'}
		</Button>
	</div>
{/if}
