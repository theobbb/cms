<script lang="ts" generics="T extends BaseItem">
	import type { Explorer, BaseItem } from '$lib/components/explorer/explorer.svelte';
	import type { Snippet } from 'svelte';
	import { use_toaster } from '../toaster/toaster-context.svelte';

	const {
		explorer,
		icon,
		columns = []
	}: {
		explorer: Explorer<T>;
		icon?: Snippet<[T]>;
		columns?: Snippet<[T]>[];
	} = $props();

	const { navigation, params, children_count, actions } = $derived(explorer);

	const toaster = use_toaster();

	let dragging: { item: T; section_i: number } | null = $state(null);

	let drag_over: { target_id: string | null; section_i: number; is_allowed: Boolean } | null =
		$state(null);

	const drag_to_allowed_tables_i: boolean[] = $derived(
		navigation.map((section, i) => {
			if (dragging?.section_i == null) return false;
			if (dragging.section_i == i) return false;

			if (params?.includes(dragging.item.id)) {
				if (dragging.section_i < i) return false;
			}
			return true;
		})
	);

	function ondragstart(event: DragEvent, item: T, section_i: number) {
		dragging = { item, section_i };
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', item.id);
		}
	}

	function ondragend(event: DragEvent) {
		cleanup();
	}

	function check_if_allowed(target_id: string | null, target_section_i: number): boolean {
		if (!dragging) return false;

		// 1. Cannot drop on self
		if (target_id === dragging.item.id) return false;

		// --- NEW LOCATION: GLOBAL DEPTH CHECK ---
		const dragged_param_index = params?.indexOf(dragging.item.id) ?? -1;

		// If the dragged item is open (it's in the path),
		// block drops on ANY column to its right (descendants)
		if (dragged_param_index !== -1 && target_section_i > dragged_param_index) {
			return false;
		}

		if (target_id) {
			if (dragging.item.parent == target_id) return false;
			return true;
		} else {
			return drag_to_allowed_tables_i[target_section_i];
		}
	}

	function ondragover(event: DragEvent, section_i: number) {
		event.preventDefault();
		if (!dragging) return;

		function not_allowed() {
			if (event.dataTransfer) event.dataTransfer.dropEffect = 'none';
		}

		const row = (event.target as HTMLElement).closest('tr');
		if (!row) {
			// If not over a <tr>, clear the drag_over state and set effect to none
			drag_over = null;

			return not_allowed();
		}

		const id_attr = row.dataset.id;
		let target_id: string | null = null;

		if (id_attr == 'table') {
			target_id = null;
		} else {
			target_id = id_attr ? String(id_attr) : null;
			if (target_id === null) return not_allowed();
		}

		const is_allowed = check_if_allowed(target_id, section_i);

		// NATIVE BROWSER INDICATOR
		if (event.dataTransfer) {
			// 'none' shows the forbidden circle cursor
			// 'move' shows the drag cursor
			event.dataTransfer.dropEffect = is_allowed ? 'move' : 'none';
		}

		if (
			target_id === drag_over?.target_id &&
			section_i === drag_over?.section_i &&
			is_allowed === drag_over?.is_allowed
		)
			return;

		drag_over = { target_id, section_i, is_allowed };
	}

	async function ondrop(event: DragEvent, target_section_i: number) {
		event.preventDefault();

		if (!dragging || !drag_over || !check_if_allowed(drag_over.target_id, target_section_i)) {
			return cleanup();
		}

		const old_parent = dragging.item.parent;

		let new_path: string[] = [];

		// SCENARIO 1: Dropped onto a item (Reparenting)
		if (drag_over.target_id) {
			dragging.item.parent = drag_over.target_id;

			const path_prefix = params ? params.slice(0, target_section_i) : [];
			new_path = [...path_prefix, drag_over.target_id, dragging.item.id];

			//console.log(`Moved ${dragging.item.id} to be child of ${drag_over.target_id}`);
		}
		// SCENARIO 2: Dropped into another table
		else {
			const new_parent_id = target_section_i === 0 ? '' : (params?.[target_section_i - 1] ?? '');
			dragging.item.parent = new_parent_id;

			const path_prefix = params ? params.slice(0, target_section_i) : [];
			new_path = [...path_prefix, dragging.item.id];
		}

		actions.save_item(dragging.item.id, dragging.item);
		explorer.actions.inspect(dragging.item.id);
		//await goto(`/tickets/${dragging.item.id}`);

		toaster.push('success', 'Deplacé de');
		cleanup();
	}

	function cleanup() {
		dragging = null;
		drag_over = null;
	}
</script>

{#snippet new_item_button(i: number)}
	<button
		class="flex h-full w-full items-center justify-center text-lg text-white/40 hover:bg-white/10 hover:text-white"
		onclick={() => explorer.actions.new_item(i)}
		style="box-shadow: inset 0 0 0 1px var(--color-background);"
	>
		+
	</button>
{/snippet}

<div class="col-span-2 whitespace-nowrap">
	<div class="flex flex-nowrap gap-4 pl-7 select-none">
		{#each navigation as col, i}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<section>
				<table ondragover={(event) => ondragover(event, i)} ondrop={(event) => ondrop(event, i)}>
					<tbody>
						<tr data-id="table">
							{#if dragging}
								<td
									colspan={3 + columns.length}
									class={[
										'text-white/50',
										!drag_to_allowed_tables_i[i] && 'pointer-events-none opacity-0'
									]}>Déplacer ici</td
								>
							{:else}
								<td>
									{@render new_item_button(i)}
								</td>
							{/if}
						</tr>

						{#each col as item}
							<tr
								draggable="true"
								data-id={item.id}
								ondragstart={(event) => {
									ondragstart(event, item, i);
								}}
								{ondragend}
								class={[
									'w-full cursor-default',
									params?.includes(item.id)
										? params?.[params.length - 1] == item.id
											? 'bg-white/20'
											: 'bg-white/10'
										: 'hover:bg-white/5',
									'border-b-2- border-transparent first:border-t-2',
									dragging?.item.id === item.id && 'opacity-30',
									drag_over?.target_id === item.id && 'bg-white/20!',
									'transition-all duration-100'
								]}
								onclick={() => explorer.actions.inspect(item.id)}
							>
								<td>
									{#if icon}
										{@render icon(item)}
									{/if}
								</td>

								<td
									class="relative max-w-48 min-w-24 overflow-hidden text-ellipsis whitespace-nowrap"
									>{item.title}</td
								>
								{#if columns}
									{#each columns as column}
										<td>
											{@render column(item)}
										</td>
									{/each}
								{/if}

								<td class="min-w-12 text-right"
									>{#if children_count.get(item.id)}
										+{children_count.get(item.id)}
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
		{/each}
		<section>
			<table>
				<tbody>
					<tr>
						<td>
							{@render new_item_button(navigation.length)}
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	</div>
</div>

<style>
	td {
		height: 2rem;

		padding: 0 0.6rem;
		box-shadow: inset 0 0 0 1px var(--color-background);
	}
	td:first-child {
		padding: 0;
		width: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
