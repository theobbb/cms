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
	<thead class="sticky top-0 z-10 bg-background">
		<tr class="border-b">
			{#if prefix_header}
				{@render prefix_header()}
			{/if}
			{#each columns as column}
				<th onclick={() => onsort?.(column)} class="group cursor-pointer text-left">
					<div
						class="-mx-2x flex min-h-8 items-center justify-between gap-2x px-2x font-normal group-hover:bg-accent-hover"
					>
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
					props.onclick && 'action cursor-pointer hover:bg-accent-hover',
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
	thead tr {
		box-shadow: inset 0 -1px 0 var(--border);
	}
</style>
