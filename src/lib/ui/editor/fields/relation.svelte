<script lang="ts" generics="T extends {id: string}">
	import Button from '$lib/ui/button.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import type { FieldProps } from '$config/field.types';
	import type { RecordListOptions } from 'pocketbase';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import RecordName from '$lib/components/record-name.svelte';
	import Search from '$lib/ui/form/search.svelte';

	let {
		id,
		name,
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
		record: any;
	} = $props();

	const pocketbase = use_pocketbase();

	const multiple = $derived(maxSelect > 1);

	// Dialog state
	let dialog_open = $state(false);
	let pop_selection = $state<T[]>([]);
	let available_records = $state<T[]>([]);
	let search = $state('');

	// Normalize value to array
	const selected_ids = $derived.by(() => {
		if (!value) return [];
		return Array.isArray(value) ? value : [value];
	});
	//$inspect(selected_ids);
	// Get display items from expanded records or available records
	const items = $derived.by(() => {
		if (!selected_ids.length) return [];

		const expanded = record?.expand?.[name];
		const expanded_arr = expanded ? (Array.isArray(expanded) ? expanded : [expanded]) : [];

		return selected_ids
			.map((id) => [...expanded_arr, ...available_records].find((item: T) => item.id === id))
			.filter(Boolean) as T[];
	});

	async function fetch_records() {
		try {
			const options: RecordListOptions = { sort: '-created' };
			const res = await pocketbase.collection(collectionId).getList<T>(1, 32, options);
			available_records = res.items;
		} catch (error) {
			console.error('Failed to fetch records:', error);
			available_records = [];
		}
	}

	function open_picker() {
		pop_selection = [...items];
		dialog_open = true;
		if (!available_records.length) fetch_records();
	}

	function close_picker() {
		dialog_open = false;
		pop_selection = [];
		search = '';
	}

	function on_search(value: string) {
		if (search === value) return;
		search = value;
		fetch_records();
	}

	function toggle_selection(item: T) {
		if (!multiple) {
			pop_selection = [item];
			return;
		}

		const exists = pop_selection.some((i) => i.id === item.id);
		pop_selection = exists
			? pop_selection.filter((i) => i.id !== item.id)
			: [...pop_selection, item];
	}

	function remove_item(item: T) {
		const new_ids = selected_ids.filter((id) => id !== item.id);
		value = new_ids;
		on_change?.(new_ids);
	}

	function save_selection() {
		const new_ids = pop_selection.map((i) => i.id);
		value = new_ids;
		on_change?.(new_ids);
		close_picker();
	}

	// Form submission handler
	onsubmit = async (form_data: FormData) => {
		if (multiple) {
			if (selected_ids.length === 0) {
				form_data.append(name, '');
			} else {
				selected_ids.forEach((id) => form_data.append(name, id));
			}
		} else {
			form_data.set(name, selected_ids[0] ?? '');
		}
	};
</script>

<div class="bg-surface text-surface-foreground">
	{#if name}
		<Label {id} label={name} {required} icon="icon-[ri--mind-map]" />
	{/if}

	{#if items.length > 0}
		<div>
			{#each items as item (item.id)}
				<div class="flex h-8 items-center justify-between gap-2 border border-b-0 px-2.5 pr-1.5">
					<div class="truncate">
						<RecordName record={item} collection={collectionId} />
					</div>
					<Button
						size="sm"
						onclick={() => remove_item(item)}
						variant="ghost"
						icon="icon-[ri--close-fill]"
					></Button>
				</div>
			{/each}
		</div>
	{/if}

	<div>
		<Button size="lg" class="w-full" onclick={open_picker}>Sélectionner</Button>
	</div>
</div>

{#if dialog_open}
	<Dialog onclose={close_picker} size="xl">
		<div class="space-y-6">
			<div class="text-lg-">Selection: {name}</div>

			<Search
				id="search-relation-{id}"
				client_override={{ on_search, on_reset: () => on_search('') }}
			/>

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
							<RecordName record={item} collection={collectionId} />
						</div>
					</button>
				{/each}
			</div>

			<div>
				<div class="mb-2 flex items-center gap-2">
					<div>Sélectionné</div>
					{#if multiple}
						({selected_ids.length} / {maxSelect})
					{:else}
						:
					{/if}
				</div>
				<div class="flex max-w-lg flex-wrap gap-1.5 text-sm">
					{#each pop_selection as selected (selected.id)}
						<div
							class="flex w-fit items-center gap-1.5 rounded-full border bg-white/10 px-2.5 pr-1.5"
						>
							<RecordName record={selected} collection={collectionId} />
							<button
								class="flex shrink-0 items-center"
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
