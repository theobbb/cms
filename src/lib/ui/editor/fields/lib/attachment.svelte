<script lang="ts">
	import { page } from '$app/state';
	import Media from '$lib/components/media.svelte';
	import { get_app, get_collection } from '$lib/logic/ctx.svelte';
	import { use_editor } from '$lib/logic/editor.svelte';
	import Button from '$lib/ui/button.svelte';

	const { file, on_remove }: { file: string | File; on_remove?: () => void } = $props();

	const editor = use_editor();
	const collection = get_collection();
	const app = get_app();

	let src = $derived.by(() => {
		if (file instanceof File) return URL.createObjectURL(file);

		if (editor?.current?.type == 'create') return '';
		return `${app.pocketbase.url}/api/files/${collection.name}/${editor?.current?.record.id}/${file}`;
	});

	$effect(() => {
		return () => {
			if (src.startsWith('blob:')) URL.revokeObjectURL(src);
		};
	});
</script>

<div class="flex items-center justify-between gap-2 py-3">
	<a class=" flex max-w-md min-w-0 flex-1 items-center gap-4" href={src} target="_blank">
		<Media {src} alt="f" thumbnail />

		<div class="truncate">{src}</div>
	</a>

	<div class="shrink-0">
		<Button onclick={on_remove} icon="icon-[ri--close-fill]" variant="ghost"></Button>
	</div>
</div>
