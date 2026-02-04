<script lang="ts" generics="T extends {id: string}">
	import Button from '$lib/ui/button.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import type { FieldProps } from '$config/field.types';
	import type { RecordListOptions } from 'pocketbase';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import RecordName from '$lib/components/record-name.svelte';
	import Search from '$lib/ui/data-table/search.svelte';

	let {
		id,
		key,
		title,
		required,
		collection: target_collection_name,
		value,
		multiple,
		record,
		on_change,
		onsubmit = $bindable()
	}: FieldProps<'relation'> & {
		on_change?: (ids: string[]) => void;
		record: any;
	} = $props();

	const pocketbase = use_pocketbase();

	// Local state for selected IDs
	let selected_ids: string[] = $state([]);

	// Initialize from value prop
	$effect(() => {
		const normalized = value ? (Array.isArray(value) ? value : [value]) : [];
		selected_ids = normalized;
	});

	// Derive display items from expanded records
	const items: T[] = $derived.by(() => {
		if (!record?.expand?.[key]) return [];

		const expanded = record.expand[key];
		const expanded_arr = Array.isArray(expanded) ? expanded : [expanded];

		return selected_ids
			.map((id) => [...expanded_arr, ...available_records].find((item: T) => item.id === id))
			.filter(Boolean) as T[];
	});

	//$inspect(items, selected_ids, record?.expand);
	// Dialog state
	let dialog_open = $state(false);
	let pop_selection: T[] = $state([]);
	let available_records: T[] = $state([]);
	let search: string = $state('');

	function open_picker() {
		pop_selection = [...items];
		dialog_open = true;
		if (!available_records.length) {
			fetch_records();
		}
	}

	function close_picker() {
		dialog_open = false;
		pop_selection = [];
		search = '';
	}

	async function fetch_records() {
		try {
			const options: RecordListOptions = {
				sort: '-created'
			};

			if (search) {
				// Add filter based on your collection's searchable fields
				// options.filter = `name ~ '${search}'`;
			}

			const res = await pocketbase.collection(target_collection_name).getList<T>(1, 32, options);
			available_records = res.items;
		} catch (error) {
			console.error('Failed to fetch records:', error);
			available_records = [];
		}
	}

	function on_search(value: string) {
		if (search === value) return;
		search = value;
		fetch_records();
	}

	function on_search_reset() {
		on_search('');
	}

	function toggle_selection(item: T) {
		if (!multiple) {
			pop_selection = [item];
			return;
		}

		const exists = pop_selection.some((i) => i.id === item.id);
		if (exists) {
			pop_selection = pop_selection.filter((i) => i.id !== item.id);
		} else {
			pop_selection = [...pop_selection, item];
		}
	}

	function remove_item(item: T) {
		selected_ids = selected_ids.filter((id) => id !== item.id);
		on_change?.(selected_ids);
	}

	function save_selection() {
		selected_ids = [...pop_selection].map((i) => i.id);
		//on_change?.(selected_ids);
		close_picker();
	}

	// Form submission handler
	onsubmit = async (form_data: FormData, cancel) => {
		if (multiple) {
			if (selected_ids.length === 0) {
				// Explicitly append empty string to clear selection in PocketBase
				form_data.append(key, '');
			} else {
				selected_ids.forEach((id) => {
					form_data.append(key, id);
				});
			}
		} else {
			form_data.set(key, selected_ids[0] ?? '');
		}
	};
</script>

<div class="bg-bg">
	{#if title}
		<Label {id} label={title} {required} />
	{/if}

	<div>
		{#each items as item (item.id)}
			<div class="flex items-center justify-between gap-2 border border-b-0 px-2.5 py-1 pr-1.5">
				<div class="truncate">
					<RecordName record={item} collection={target_collection_name} />
				</div>
				<Button size="sm" onclick={() => remove_item(item)} variant="ghost">
					<span class="icon-[ri--close-fill]"></span>
				</Button>
			</div>
		{/each}
	</div>

	<div>
		<Button variant="discrete" size="lg" class="w-full" onclick={open_picker}>Sélectionner</Button>
	</div>
</div>

{#if dialog_open}
	<Dialog onclose={close_picker} size="xl">
		<div class="space-y-6">
			<div class="text-lg-">Selection: {title}</div>
			<div>
				<Search
					id="search-relation-{id}"
					client_override={{ on_search, on_reset: on_search_reset }}
				/>
			</div>

			<div class="max-h-64 divide-y overflow-y-auto border">
				{#each available_records as item (item.id)}
					<button
						type="button"
						class="flex w-full cursor-pointer items-center gap-3 px-2.5 py-1.5 hover:bg-white/15"
						onclick={() => toggle_selection(item)}
					>
						{#if pop_selection.some((i) => i.id === item.id)}
							<span class="icon-[ri--checkbox-line] text-lg"></span>
						{:else}
							<span class="text-2 icon-[ri--checkbox-blank-line] text-lg"></span>
						{/if}

						<div class="truncate text-left">
							<RecordName record={item} collection={target_collection_name} />
						</div>
					</button>
				{/each}
			</div>

			<div>
				<div class="mb-2">Sélectionné:</div>
				<div class="flex max-w-lg flex-wrap gap-1.5">
					{#each pop_selection as selected (selected.id)}
						<div class="flex w-fit items-center gap-1.5 rounded-full border bg-white/10 px-2.5">
							<RecordName record={selected} collection={target_collection_name} />
							<button
								type="button"
								onclick={() => {
									pop_selection = pop_selection.filter((i) => i.id !== selected.id);
								}}
							>
								<span class="icon-[ri--close-fill]"></span>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="flex justify-end gap-1.5 border-t pt-3">
				<Button size="lg" variant="ghost" onclick={close_picker}>Annuler</Button>
				<Button size="lg" variant="action" onclick={save_selection}>Enregistrer</Button>
			</div>
		</div>
	</Dialog>
{/if}
