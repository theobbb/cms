<script lang="ts">
	import Media from '$lib/components/media.svelte';
	import Button from '$lib/ui/button.svelte';

	const { file, on_remove }: { file: string | File; on_remove?: () => void } = $props();

	let src = $derived.by(() => {
		if (file instanceof File) return URL.createObjectURL(file);

		// Case B: Existing Image (String) -> Use your Imgproxy logic
		if (typeof file === 'string') {
			return file;
		}
		return '';
	});

	$effect(() => {
		return () => {
			if (src.startsWith('blob:')) URL.revokeObjectURL(src);
		};
	});
</script>

<div class="flex items-center justify-between gap-2 py-3">
	<a
		class=" flex max-w-[calc(var(--spacing-drawer)-var(--spacing-gap)*6)] min-w-0 flex-1 items-center gap-4"
		href={src}
		target="_blank"
	>
		<Media {src} alt="f" thumbnail />

		<div class="max-w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{src}</div>
	</a>

	<div class="shrink-0">
		<Button onclick={on_remove} icon variant="ghost">
			<span class="icon-[ri--close-fill]"></span>
		</Button>
	</div>
</div>
