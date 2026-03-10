<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { CollectionField, RecordModel } from 'pocketbase';

	const {
		columns,
		items,
		sort_param = '',
		onsort,
		cell,
		prefix_header,
		prefix_cell,
		row_props = () => ({})
	}: {
		columns: CollectionField[];
		items: RecordModel[];
		sort_param?: string;
		onsort?: (column: CollectionField) => void;
		cell: Snippet<[RecordModel, CollectionField]>;
		prefix_header?: Snippet;
		prefix_cell?: Snippet<[RecordModel]>;
		row_props?: (row: RecordModel) => Record<string, any>;
	} = $props();
</script>

<table class="w-full">
	<thead class="bg-background sticky top-0 z-10">
		<tr>
			{#if prefix_header}
				{@render prefix_header()}
			{/if}
			{#each columns as column}
				<th onclick={() => onsort?.(column)} class="cursor-pointer text-left">
					<div class="flex min-h-8 items-center justify-between gap-md font-normal">
						<div>{column.label || column.name}</div>
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
		{#each items as row (row.id)}
			{@const { class: cx, ...props } = row_props(row)}
			<tr
				{...props}
				class={[
					cx,
					'border-b first:border-t',
					props.onclick && 'action hover:bg-accent/30 cursor-pointer',
					props.selected && 'bg-accent!'
				]}
			>
				{#if prefix_cell}
					{@render prefix_cell(row)}
				{/if}
				{#each columns as column}
					<td>{@render cell(row, column)}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	td,
	th {
		user-select: none;
		padding: 0.25rem 0.8rem;
		max-width: 14rem;
	}
	td:first-child,
	th:first-child {
		width: 1rem;
	}
	th:not(:first-child):hover {
		box-shadow: inset 0 -2px 0 currentColor;
	}
	tbody tr.action:hover {
		box-shadow: inset -2px 0 0 currentColor;
	}
	thead tr {
		box-shadow: inset 0 -1px 0 var(--border);
	}
</style>
