<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	let {
		items = [],
		multiple = false,
		class: cx,
		on_reorder,
		children
	}: {
		items: T[];
		multiple?: boolean;
		class?: ClassValue;
		on_reorder?: (items: T[]) => void;
		children: Snippet<[T, number]>;
	} = $props();

	let dragged_index: number | null = $state(null);
	let hovered_index: number | null = $state(null);

	function on_item_drag_start(e: DragEvent, i: number) {
		if (!multiple) return;
		dragged_index = i;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', i.toString()); // Firefox requirement
		}
	}

	function on_item_drag_enter(e: DragEvent, i: number) {
		if (!multiple || dragged_index === null || dragged_index === i) return;
		e.preventDefault();
		hovered_index = i;
	}

	function on_item_drag_over(e: DragEvent, i: number) {
		if (!multiple || dragged_index === null) return;
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
	}

	function on_item_drag_leave(e: DragEvent, i: number) {
		if (hovered_index === i) {
			hovered_index = null;
		}
	}

	function on_item_drop(e: DragEvent, i: number) {
		if (!multiple || dragged_index === null) return;
		e.preventDefault();
		e.stopPropagation();

		if (dragged_index !== i) {
			const new_items = [...items];
			const [moved_item] = new_items.splice(dragged_index, 1);
			new_items.splice(i, 0, moved_item);
			on_reorder?.(new_items);
		}

		dragged_index = null;
		hovered_index = null;
	}

	function on_item_drag_end() {
		dragged_index = null;
		hovered_index = null;
	}
</script>

<div class={cx}>
	{#each items as item, i}
		<div
			role="listitem"
			draggable={multiple}
			ondragstart={(e) => on_item_drag_start(e, i)}
			ondragenter={(e) => on_item_drag_enter(e, i)}
			ondragover={(e) => on_item_drag_over(e, i)}
			ondragleave={(e) => on_item_drag_leave(e, i)}
			ondrop={(e) => on_item_drop(e, i)}
			ondragend={on_item_drag_end}
			class={[
				'cursor-default',
				hovered_index === i && 'relative z-10 ring-2 ring-primary',
				dragged_index !== null && '**:pointer-events-none'
			]}
		>
			{@render children(item, i)}
		</div>
	{/each}
</div>
