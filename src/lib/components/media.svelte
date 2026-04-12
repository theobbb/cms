<script lang="ts">
	const {
		src,
		alt,
		thumbnail = false
	}: {
		src: string;
		alt: string;
		thumbnail?: boolean;
	} = $props();

	const url: string = $derived.by(() => {
		if (src.startsWith('blob')) return src;
		if (src.endsWith('.mp4')) return src;

		const url = new URL(src);
		url.searchParams.set('format', 'webp');
		if (thumbnail) url.searchParams.set('thumb', '100x100');
		return url.toString();
	});
</script>

{#if src}
	{#if src.endsWith('.mp4')}
		{#if thumbnail}
			<div class="bg-text/10 flex aspect-square size-6 items-center justify-center">
				<span class="icon-[ri--video-line]"></span>
			</div>
		{:else}
			<video class="h-full w-full object-contain" src={url}></video>
		{/if}
	{:else}
		<img loading="lazy" class={[thumbnail ? 'aspect-square max-h-6' : '']} src={url} {alt} />
	{/if}
{:else}
	:(
{/if}
