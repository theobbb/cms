<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import type { FieldProps } from '$config/field.types';
	import type { CollectionModel, RecordListOptions, RecordModel } from 'pocketbase';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Search from '$lib/ui/form/search.svelte';
	import RecordPresentable from '$lib/components/record-presentable.svelte';
	import { page } from '$app/state';
	import { get_search_keys } from '$config/utils';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';

	let {
		id,
		name,
		label,
		required,
		collectionId,
		value,
		minSelect,
		maxSelect,
		record,
		on_change,
		onsubmit = $bindable()
	}: FieldProps<'relation'> & {
		on_change?: (ids: string[]) => void;
		label?: string;
		record: any;
	} = $props();

	const pocketbase = use_pocketbase();

	const multiple = $derived(maxSelect > 1);
	const collection: CollectionModel | undefined = $derived(
		page.data.id_collections?.[collectionId]
	);

	// Dialog state
	let dialog_picker = new Pop();
	let pop_selection = $state<RecordModel[]>([]);
	let available_records = $state<RecordModel[]>([]);

	// Normalize value to array
	const selected_ids = $derived.by(() => {
		if (!value) return [];
		return Array.isArray(value) ? value : [value];
	});

	// Get display items strictly from the cache + current availability
	const items = $derived.by(() => {
		if (!selected_ids.length) return [];

		const expanded = record?.expand?.[name];
		const expanded_arr = expanded ? (Array.isArray(expanded) ? expanded : [expanded]) : [];

		return selected_ids
			.map((id) =>
				[...expanded_arr, ...available_records].find((item: RecordModel) => item.id === id)
			)
			.filter(Boolean) as RecordModel[];
	});

	async function fetch_records(search: string = '') {
		if (!collection) return;

		search = search.trim();
		try {
			const options: RecordListOptions = { sort: '-created' };
			options.filter = get_search_keys(search, collection.presentable_keys);

			const res = await pocketbase.collection(collectionId).getList<RecordModel>(1, 32, options);
			available_records = res.items;
		} catch (error) {
			console.error('Failed to fetch records:', error);
			available_records = [];
		}
	}

	function open_picker() {
		pop_selection = [...items];
		dialog_picker.show();
		if (!available_records.length) fetch_records();
	}

	function close_picker() {
		dialog_picker.close();
		pop_selection = [];
	}

	function on_search(value: string) {
		fetch_records(value);
	}

	function toggle_selection(item: RecordModel) {
		const exists = pop_selection.some((i) => i.id === item.id);

		if (exists) {
			pop_selection = pop_selection.filter((i) => i.id !== item.id);
		} else {
			if (!multiple) {
				pop_selection = [item];
			} else {
				// FIX: Enforce maxSelect
				if (maxSelect && pop_selection.length >= maxSelect) {
					// Optional: Add toast/alert here
					return;
				}
				pop_selection = [...pop_selection, item];
			}
		}
	}

	function remove_item(item: RecordModel) {
		const new_ids = selected_ids.filter((id) => id !== item.id);
		value = multiple ? new_ids : (new_ids[0] ?? null);
		on_change?.(new_ids);
	}

	function save_selection() {
		const new_ids = pop_selection.map((i) => i.id);
		value = multiple ? new_ids : (new_ids[0] ?? null);
		on_change?.(new_ids);
		close_picker();
	}

	// Form submission handler
	onsubmit = async (form_data: FormData) => {
		// Clean existing entries for this name to prevent duplicates if called multiple times
		form_data.delete(name);

		if (selected_ids.length === 0) {
			form_data.append(name, '');
		} else {
			selected_ids.forEach((id) => form_data.append(name, id));
		}
	};
</script>

{#if collection}
	<div class="bg-surface text-surface-foreground">
		{#if name}
			<Label {id} label={label || name} {required} icon="icon-[ri--mind-map]" />
		{/if}

		{#if items.length > 0}
			<div class="flex flex-col">
				{#each items as item (item.id)}
					<div class="flex h-10 items-center justify-between gap-2 border border-b-0 px-2.5 pr-1.5">
						<div class="truncate">
							<RecordPresentable record={item} {collection} />
						</div>
						<Button
							size="sm"
							onclick={() => remove_item(item)}
							variant="ghost"
							icon="icon-[ri--close-fill]"
							aria-label="Remove item"
						/>
					</div>
				{/each}
			</div>
		{/if}

		<div>
			<Button size="lg" class="w-full" onclick={open_picker}>Sélectionner</Button>
		</div>
	</div>

	{#if dialog_picker.open}
		<Dialog pop={dialog_picker} onclose={close_picker} size="xl">
			<div class="flex max-h-[80svh] flex-col gap-4">
				<div class="text-lg font-medium">Sélection: {label || name}</div>

				<Search {on_search} />

				<div class="bg-surface-50 flex-1 divide-y overflow-y-auto border">
					{#if available_records.length === 0}
						<div class="text-muted-foreground p-4 text-center text-sm">Aucun résultat</div>
					{/if}

					{#each available_records as item (item.id)}
						{@const selected = pop_selection.some((i) => i.id === item.id)}
						<button
							type="button"
							class={[
								'flex h-10 w-full cursor-pointer items-center gap-3 px-2.5',
								selected ? 'bg-accent' : 'hover:bg-accent-hover'
							]}
							onclick={() => toggle_selection(item)}
						>
							{#if selected}
								<span class="text-primary icon-[ri--checkbox-line] text-xl"></span>
							{:else}
								<span class="text-muted-foreground icon-[ri--checkbox-blank-line] text-xl"></span>
							{/if}
							<div class="flex-1 truncate text-left">
								<RecordPresentable record={item} {collection} />
							</div>
						</button>
					{/each}
				</div>

				<div class="space-y-3 border-t pt-3">
					<div class="text-foreground-muted flex items-center gap-2 text-sm">
						<div>Sélectionné</div>
						{#if multiple}
							({pop_selection.length} / {maxSelect})
						{/if}
					</div>

					<div class="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
						{#each pop_selection as selected (selected.id)}
							<div
								class="bg-surface-100 flex w-fit items-center gap-1.5 rounded-full border py-0.5 pr-1 pl-2 text-xs"
							>
								<span class="max-w-24 truncate">
									<RecordPresentable record={selected} {collection} />
								</span>
								<button
									class="hover:bg-surface-200 flex shrink-0 items-center rounded-full p-0.5"
									type="button"
									onclick={() => toggle_selection(selected)}
								>
									<span class="icon-[ri--close-fill]"></span>
								</button>
							</div>
						{/each}
					</div>

					<div class="flex justify-end gap-2">
						<Button size="lg" variant="ghost" onclick={close_picker}>Annuler</Button>
						<Button size="lg" variant="action" onclick={save_selection}>Enregistrer</Button>
					</div>
				</div>
			</div>
		</Dialog>
	{/if}
{:else}
	Collection not found
{/if}
