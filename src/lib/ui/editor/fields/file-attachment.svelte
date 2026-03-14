<script lang="ts">
	import Media from '$lib/components/media.svelte';
	import { get_app, get_collection } from '$lib/logic/ctx.svelte';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte';
	import Button from '$lib/ui/components/button.svelte';

	const { file, on_remove }: { file: string | File; on_remove?: () => void } = $props();

	const editor = use_editor();
	const collection = get_collection();
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
			src = `${app.pocketbase.url}/api/files/${collection.id}/${editor?.current?.record.id}/${file}`;
		}
	});
</script>

<div class="flex items-center justify-between gap-2 py-3">
	<a class="flex max-w-md min-w-0 flex-1 items-center gap-4" href={src} target="_blank">
		<Media {src} alt={display_name} thumbnail />

		<div class="truncate">{display_name}</div>
	</a>

	<div class="shrink-0">
		<Button onclick={on_remove} icon="icon-[ri--close-fill]" variant="ghost"></Button>
	</div>
</div>
