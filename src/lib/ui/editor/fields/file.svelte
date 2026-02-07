<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import type { FieldProps } from '$config/field.types';
	import Attachment from './lib/attachment.svelte';
	import { use_editor } from '$lib/logic/editor.svelte';

	let {
		id,
		name,
		value,
		minSelect,
		maxSelect,
		onsubmit = $bindable()
	}: FieldProps<'file'> = $props();

	const multiple = $derived(maxSelect > 1);
	let files: (string | File)[] = $state([]);

	let is_over = $state(false);

	const editor = use_editor();

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
	function handle_file(file: File) {
		//if (!file.type.startsWith('image/')) return;
		files.push(file);
	}

	function on_drag_over(e: DragEvent) {
		console.log('drag over');
		e.preventDefault(); // Required to allow a drop
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

		if (multiple) {
			Array.from(dropped_files).forEach(handle_file);
		} else {
			handle_file(dropped_files[0]);
		}
	}

	onsubmit = async (form_data: FormData, cancel) => {
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
	};
</script>

<div
	class={['bg-background', is_over && 'ring-3']}
	ondragover={on_drag_over}
	ondragleave={on_drag_leave}
	ondrop={on_drop}
	role="presentation"
>
	<Label {id} label={name || ''} />

	<div class={['divide-y border border-b-0 px-3', !files.length && 'border-t-0']}>
		{#each files as file, i}
			<Attachment {file} on_remove={() => files.splice(i, 1)} />
		{/each}
	</div>

	<Button onclick={upload} class="w-full" size="lg" disabled={(files.length && !multiple) || false}
		>Upload</Button
	>

	<input
		class="hidden"
		type="file"
		bind:this={fake_file_input}
		onchange={(e) => e.currentTarget.files?.[0] && handle_file(e.currentTarget.files[0])}
	/>
</div>
