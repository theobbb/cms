<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import Button from '../button.svelte';
	import Label from './label.svelte';

	const {
		required,
		items,
		item_renderer,
		label,
		on_add_item,
		add_item_text = 'Sélectionner',
		on_remove_item
	}: {
		required?: boolean;
		items: T[];
		item_renderer: Snippet<[T]>;
		label?: string;
		on_add_item: () => void;
		on_remove_item: (item: T) => void;
		add_item_text?: string;
	} = $props();

	const props_id = $props.id();
</script>

<div class="bg-surface text-surface-foreground">
	{#if label}
		<Label id={props_id} {label} {required} />
	{/if}
	<div>
		{#each items as item}
			<div class="flex items-center justify-between gap-2 border border-b-0 px-2.5 pr-1.5">
				<div
					class="max-w-[calc(var(--spacing-drawer)-6*var(--spacing-gap))] overflow-hidden text-ellipsis whitespace-nowrap"
				>
					{@render item_renderer(item)}
				</div>
				<Button
					size="sm"
					onclick={() => on_remove_item(item)}
					icon="icon-[ri--close-fill]"
					variant="ghost"
				/>
			</div>
		{/each}
	</div>
	<div>
		<Button variant="discrete" size="lg" class="w-full" onclick={on_add_item}
			>{add_item_text}</Button
		>
	</div>
</div>
