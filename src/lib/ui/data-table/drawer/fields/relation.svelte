<script lang="ts" generics="T">
	import { pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import type { FieldProps } from '../field.types';
	import type { BaseSystemFields } from '$lib/pocketbase.types';
	import type { RecordListOptions } from 'pocketbase';
	import Search from '../../../form/search.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';

	let {
		id,
		name,
		value,
		label,
		display_key,
		display_fn,
		required,
		collection,
		multiple,
		expand,
		count,
		on_change,
		onsubmit = $bindable()
	}: FieldProps<'relation'> & {
		expand?: T | T[] | null;
		display_key: keyof T;
		on_change?: (ids: string[]) => void;
	} = $props();

	type Item = T & BaseSystemFields;

	let initial_ids: string[] = $state(value ? (Array.isArray(value) ? value : [value]) : []);
	let items: Item[] = $derived(expand ? (Array.isArray(expand) ? expand : [expand]) : []);

	let pop_selection: Item[] = $state([]);

	let dialog_picker_open = $state(false);
	function close_dialog_picker() {
		dialog_picker_open = false;
	}

	function open_picker() {
		pop_selection = [...items];
		dialog_picker_open = true;
		if (!data?.length) fetch_data();
	}

	let data: Item[] = $state([]);

	let search: string = $state('');
	function on_search(value: string) {
		if (search == value) return;
		search = value;
		fetch_data();
	}

	function display(record: T) {
		if (display_fn) return display_fn(record);
		return String(record[display_key]);
	}

	function on_search_reset() {
		on_search('');
	}

	async function fetch_data() {
		const options: RecordListOptions = {
			sort: '-created'
		};

		if (search) options.filter = `${String(display_key)} ~ '${search}'`;

		const res = await pocketbase.collection(collection).getList<Item>(1, 32, options);
		data = res.items;
	}

	function select_item(item: Item) {
		if (!multiple) {
			pop_selection = [item];
			return;
		}
		const exists_index = pop_selection.findIndex((i) => i.id == item.id);
		if (exists_index != -1) {
			pop_selection.splice(exists_index, 1);
			return;
		}

		pop_selection.push(item);
	}

	function remove_item(item: Item) {
		if (multiple) {
			expand = items.filter((i) => i.id !== item.id);
		} else {
			expand = null;
		}
	}

	function save() {
		if (multiple) {
			expand = pop_selection;
		} else {
			// If single mode, unwrap the array (or return null if empty)
			expand = pop_selection[0] ?? null;
		}
		close_dialog_picker();

		if (on_change) on_change([...items].map((i) => i.id));
	}

	async function update_counts() {
		if (!count) return;

		const current_ids = items.map((i) => i.id);
		// Find what was added and what was removed
		const added = current_ids.filter((id) => !initial_ids.includes(id));
		const removed = initial_ids.filter((id) => !current_ids.includes(id));

		const batch_updates = [
			...added.map((id) =>
				pocketbase.collection(collection).update(id, {
					[`${String(count)}+`]: 1 // PocketBase increment syntax
				})
			),
			...removed.map((id) =>
				pocketbase.collection(collection).update(id, {
					[`${String(count)}-`]: 1 // PocketBase decrement syntax
				})
			)
		];

		try {
			await Promise.all(batch_updates);
			// Update initial_ids so subsequent saves in the same session work correctly
			initial_ids = [...current_ids];
		} catch (err) {
			console.error('Failed to update counts:', err);
		}
	}

	onsubmit = async (form_data: FormData, cancel) => {
		if (multiple) {
			if (items.length === 0) {
				// FIX: Explicitly append an empty string to clear the selection in PocketBase
				form_data.append(name, '');
			} else {
				items.forEach((item) => {
					form_data.append(name, item.id);
				});
			}
		} else {
			form_data.set(name, items[0]?.id ?? '');
		}
		if (count)
			return () => {
				update_counts();
			};
	};
</script>

<div class="bg-bg">
	{#if label}
		<Label {id} {label} {required} />
	{/if}
	<div>
		{#each items as item}
			<div class="flex items-center justify-between gap-2 border border-b-0 px-2.5 pr-1.5">
				<div
					class="max-w-[calc(var(--spacing-drawer)-6*var(--spacing-gap))] overflow-hidden text-ellipsis whitespace-nowrap"
				>
					{display(item)}
				</div>
				<Button size="sm" onclick={() => remove_item(item)} icon variant="ghost">
					<span class="icon-[ri--close-fill]"></span>
				</Button>
			</div>
		{/each}
	</div>
	<div>
		<Button variant="discrete" size="lg" class="w-full" onclick={open_picker}>Sélectionner</Button>
	</div>
</div>

{#if dialog_picker_open}
	<Dialog onclose={close_dialog_picker} size="xl">
		<div class=" space-y-6">
			<div class="text-lg">Selection: {label}</div>
			<div>
				<Search
					id="search-relation-{id}"
					client_override={{ on_search, on_reset: on_search_reset }}
				/>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="max-h-64 divide-y overflow-y-auto border">
				{#each data as item}
					<div>
						<div
							class="flex cursor-pointer items-center gap-3 px-2.5 py-2 hover:bg-white/15"
							onclick={() => select_item(item)}
						>
							{#if pop_selection.find((i) => i.id == item.id)}
								<span class="icon-[ri--checkbox-line] text-lg"></span>
							{:else}
								<span class="text-2 icon-[ri--checkbox-blank-line] text-lg"></span>
							{/if}

							<div class="">
								{display(item)}
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div>
				<div class="mb-2">Sélectionné:</div>
				<div class="flex max-w-lg flex-wrap gap-1.5">
					{#each pop_selection as selected, i}
						<div class="flex w-fit items-center gap-1.5 rounded-full border bg-white/10 px-2.5">
							{display(selected)}
							<button type="button" onclick={() => pop_selection.splice(i, 1)}>
								<span class="icon-[ri--close-fill]"></span>
							</button>
						</div>
					{/each}
				</div>
			</div>
			<div class="flex justify-end gap-1.5 border-t pt-3">
				<Button size="lg" variant="ghost" onclick={close_dialog_picker}>Annuler</Button>
				<Button size="lg" variant="action" onclick={save}>Enregistrer</Button>
			</div>
		</div>
	</Dialog>
{/if}
