<script lang="ts" generics="T extends {id: string}">
	import Button from '$lib/ui/button.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import type { FieldProps } from '$config/field.types';
	import type { RecordListOptions } from 'pocketbase';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import { get_app } from '$lib/logic/ctx.svelte';
	import RecordName from '$lib/components/record-name.svelte';

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
	const app = get_app();

	const target_collection = $derived(app.collections[target_collection_name]);

	//const value = $derived(editor.current?.type == 'update' ? editor.current?.record?.[key] : []);
	//$inspect(value, editor.current);
	let value_arr: string[] = $derived(value ? (Array.isArray(value) ? value : [value]) : []);
	let items: T[] = $derived(
		Array.isArray(record?.[key]) ? record?.expand[key] : [record?.expand[key]]
	);

	let pop_selection: T[] = $state([]);

	let dialog_picker_open = $state(false);
	function close_dialog_picker() {
		dialog_picker_open = false;
	}

	function open_picker() {
		pop_selection = [...items];
		dialog_picker_open = true;
		if (!data?.length) fetch_data();
	}

	let data: T[] = $state([]);

	let search: string = $state('');
	function on_search(value: string) {
		if (search == value) return;
		search = value;
		fetch_data();
	}

	function on_search_reset() {
		on_search('');
	}

	async function fetch_data() {
		const options: RecordListOptions = {
			sort: '-created'
		};

		//if (search) options.filter = `${String(expand?.display_key)} ~ '${search}'`;

		const res = await pocketbase.collection(target_collection_name).getList<T>(1, 32, options);
		data = res.items;
	}

	function select_item(item: T) {
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

	function remove_item(item: T) {
		if (multiple) {
			record.expand = items.filter((i) => i.id !== item.id);
		} else {
			record.expand = null;
		}
	}

	function save() {
		if (multiple) {
			record.expand = pop_selection;
		} else {
			// If single mode, unwrap the array (or return null if empty)
			record.expand = pop_selection[0] ?? null;
		}
		close_dialog_picker();

		if (on_change) on_change([...items].map((i) => i.id));
	}

	onsubmit = async (form_data: FormData, cancel) => {
		if (multiple) {
			if (items.length === 0) {
				// FIX: Explicitly append an empty string to clear the selection in PocketBase
				form_data.append(key, '');
			} else {
				items.forEach((item) => {
					form_data.append(key, item.id);
				});
			}
		} else {
			form_data.set(key, items[0]?.id ?? '');
		}
	};
</script>

<div class="bg-bg">
	{#if title}
		<Label {id} label={title} {required} />
	{/if}
	<div>
		{#each items as item}
			<div class="flex items-center justify-between gap-2 border border-b-0 px-2.5 py-1 pr-1.5">
				<div class="truncate">
					<RecordName record={item} collection={target_collection_name} />
					<!-- {display(item)} -->
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

{#if dialog_picker_open}
	<Dialog onclose={close_dialog_picker} size="xl">
		<div class=" space-y-6">
			<div class="text-lg">Selection: {title}</div>
			<!-- <div>
				<Search
					id="search-relation-{id}"
					client_override={{ on_search, on_reset: on_search_reset }}
				/>
			</div> -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="max-h-64 divide-y overflow-y-auto border">
				{#each data as item}
					<div>
						<div
							class="flex cursor-pointer items-center gap-3 px-2.5 py-1.5 hover:bg-white/15"
							onclick={() => select_item(item)}
						>
							{#if pop_selection.find((i) => i?.id == item?.id)}
								<span class="icon-[ri--checkbox-line] text-lg"></span>
							{:else}
								<span class="text-2 icon-[ri--checkbox-blank-line] text-lg"></span>
							{/if}

							<div class="">
								<RecordName record={item} collection={target_collection_name} />
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
							<RecordName record={selected} collection={target_collection_name} />
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
