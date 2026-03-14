<script lang="ts">
	import Label from '$lib/ui/components/form/label.svelte';
	import type { FieldProps } from '$config/field.types';
	import FileAttachment from './file-attachment.svelte';
	import FieldButton from '../field-button.svelte';
	import { use_form_action, type FormActionContext } from '$lib/logic/form-action.svelte';
	import Error from '$lib/ui/components/form/error.svelte';

	let { id, name, value, minSelect, maxSelect, mimeTypes, required, ...props }: FieldProps<'file'> =
		$props();

	const multiple = $derived(maxSelect > 1);
	// Build the accept string for the file input (e.g. "image/png,image/jpeg")
	const accept = $derived(mimeTypes?.length ? mimeTypes.join(',') : undefined);

	let files: (string | File)[] = $state([]);
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
		e.preventDefault();
		is_over = true;
	}

	function on_drag_leave() {
		is_over = false;
	}

	function on_drop(e: DragEvent) {
		e.preventDefault();
		is_over = false;
		const dropped_files = e.dataTransfer?.files;
		if (!dropped_files || dropped_files.length === 0) return;
		handle_files(multiple ? Array.from(dropped_files) : [dropped_files[0]]);
	}

	const form_action = use_form_action();

	form_action?.register_hook(async ({ form_data, cancel }: FormActionContext) => {
		const kept_files = new Set(files.filter((item) => typeof item === 'string'));

		const server_strings = (Array.isArray(value) ? value : [value || []])
			.flat()
			.filter((v) => typeof v === 'string');

		// 2. Handle Deletions:
		// If it's in 'value' (Server) but NOT in 'files' (UI), it must be deleted.
		server_strings.forEach((server_file) => {
			if (!kept_files.has(server_file)) {
				const filename = server_file.split('/').pop();
				if (!filename) return;
				form_data.append(name + '-', filename);
			}
		});

		// 3. Handle New Uploads:
		files.forEach(async (item) => {
			if (item instanceof File) {
				const form_data_key = multiple ? name + '+' : name;
				form_data.append(form_data_key, item);
			}
		});
	});
</script>

<div
	class={['bg-surface text-surface-foreground', is_over && 'ring-3']}
	ondragover={on_drag_over}
	ondragleave={on_drag_leave}
	ondrop={on_drop}
	role="presentation"
>
	<Label {id} label={name || ''} icon="icon-[ri--image-line]" />

	<div class={['divide-y border border-b-0 px-3', !files.length && 'border-t-0']}>
		{#each files as file, i}
			<FileAttachment {file} on_remove={() => files.splice(i, 1)} />
		{/each}
	</div>

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
