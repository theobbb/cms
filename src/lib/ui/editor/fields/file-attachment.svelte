<script lang="ts">
	import Media from '$lib/components/media.svelte';
	import { get_app } from '$lib/logic/ctx.svelte';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte';

	const {
		file,
		record_id,
		collection
	}: {
		file: string | File;
		record_id: string | null | undefined;
		collection: string;
	} = $props();

	const editor = use_editor();
	const app = get_app();

	// 1. Convert src to state so we can mutate it safely in an effect
	let src = $state('');

	// 2. Create a clean display name for the UI
	let display_name = $derived(file instanceof File ? file.name : file);

	// 3. Move the side-effect (createObjectURL) into an effect
	$effect(() => {
		if (file instanceof File) {
			const object_url = URL.createObjectURL(file);
			src = object_url;

			// The cleanup function now cleanly captures the exact URL generated
			return () => {
				URL.revokeObjectURL(object_url);
			};
		}

		// Handle Pocketbase server files
		if (editor?.current?.method === 'create') {
			src = '';
		} else {
			src = `${app.pocketbase.url}/api/files/${collection}/${record_id}/${file}`;
		}
	});
</script>

<div class="py-3">
	<a class="flex max-w-md min-w-0 flex-1 items-center gap-4 pl-1.5" href={src} target="_blank">
		<Media {src} alt={display_name} thumbnail />

		<div class="truncate">{display_name}</div>
	</a>
</div>
