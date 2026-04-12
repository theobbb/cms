<script lang="ts">
	import Label from '$lib/ui/components/form/label.svelte';
	import type { FieldProps } from '$config/field.types';
	import FileAttachment from './file-attachment.svelte';
	import FieldButton from '../field-button.svelte';
	import { use_form_action, type FormActionContext } from '$lib/logic/form-action.svelte';
	import Error from '$lib/ui/components/form/error.svelte';
	import SortableList from '$lib/ui/components/sortable-list.svelte';
	import { get_collection } from '$lib/logic/ctx.svelte';
	import type { RecordModel } from 'pocketbase';
	import type { Snippet } from 'svelte';
	import ListItem from '$lib/ui/components/list-item.svelte';

	let {
		files = $bindable([]),
		id,
		name,
		label,
		value,
		minSelect,
		maxSelect,
		mimeTypes,
		required,
		record,
		collection: outer_collection,
		children: outer_children,
		...props
	}: FieldProps<'file'> & {
		files: (string | File)[];
		record: RecordModel;
		collection?: string;
		children?: Snippet<[any, number]>;
	} = $props();

	const multiple = $derived(maxSelect > 1);
	const accept = $derived(mimeTypes?.length ? mimeTypes.join(',') : undefined);

	const collection = outer_collection || get_collection()?.id;

	let is_over = $state(false);

	$effect(() => {
		if (!value) {
			files = [];
			return;
		}
		const new_values = Array.isArray(value) ? value : [value];
		files = [...new_values];
	});

	let fake_file_input: HTMLInputElement;

	function upload() {
		if (files.length && !multiple) return;
		fake_file_input.click();
	}

	function handle_files(incoming: File[]) {
		incoming.forEach((file) => files.push(file));
	}

	function on_input_change(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		if (!input.files?.length) return;
		handle_files(Array.from(input.files));
		input.value = '';
	}

	function on_drag_over(e: DragEvent) {
		// Only trigger visual state if the drag contains actual files

		if (e.dataTransfer?.types.includes('Files')) {
			e.preventDefault();
			is_over = true;
		}
	}

	function on_drag_leave() {
		is_over = false;
	}

	function on_drop(e: DragEvent) {
		// Check types again to ensure we don't process internal reorders as new uploads
		if (!e.dataTransfer?.types.includes('Files')) return;

		e.preventDefault();
		is_over = false;

		const dropped_files = e.dataTransfer?.files;
		if (!dropped_files || dropped_files.length === 0) return;

		handle_files(multiple ? Array.from(dropped_files) : [dropped_files[0]]);
	}

	const form_action = use_form_action();

	form_action?.register_hook(async ({ form_data, cancel }: FormActionContext) => {
		form_data.delete(name);

		if (files.length === 0) {
			form_data.append(name, '');
			return;
		}

		files.forEach((item) => {
			if (typeof item === 'string') {
				const filename = item.split('/').pop();
				if (filename) form_data.append(name, filename);
			} else if (item instanceof File) {
				form_data.append(name, item);
			}
		});
	});
</script>

<div
	class={['bg-surface text-surface-foreground', is_over && 'ring-2']}
	ondragover={on_drag_over}
	ondragleave={on_drag_leave}
	ondrop={on_drop}
	role="presentation"
>
	<Label {id} label={label || name || ''} icon="icon-[ri--image-line]" />

	<SortableList
		items={files}
		{multiple}
		on_reorder={(new_files) => (files = new_files)}
		class={[!files.length && 'border-t-0']}
	>
		{#snippet children(file, i)}
			<ListItem on_remove={() => files.splice(i, 1)}>
				{#if outer_children}
					{@render outer_children(file, i)}
				{:else}
					<FileAttachment
						{file}
						record_id={record.id}
						{collection}
						on_remove={() => files.splice(i, 1)}
					/>
				{/if}
			</ListItem>
		{/snippet}
	</SortableList>

	<FieldButton onclick={upload} disabled={(files.length && !multiple) || false}>Upload</FieldButton>

	<Error {name} />

	<input
		{accept}
		multiple={multiple || undefined}
		class="hidden"
		type="file"
		bind:this={fake_file_input}
		onchange={on_input_change}
		aria-hidden="true"
		tabindex="-1"
	/>
</div>
