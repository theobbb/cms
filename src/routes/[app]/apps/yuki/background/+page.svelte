<script>
	import CanvasInner from '../canvas/canvas-inner.svelte';
	import CanvasLayout from '../canvas/canvas-layout.svelte';
	import { CanvasManager } from '../canvas/canvas-manager.svelte.js';

	const { data } = $props();

	const canvas = new CanvasManager(data.collections.background_posts, { absolute: true });
</script>

<CanvasLayout {canvas}>
	<div
		class="relative col-span-5 mx-auto mt-12 aspect-4/1 w-full overflow-visible border bg-surface ring-2"
	>
		<div class="absolute inset-0 flex flex-col items-center"><CanvasInner {canvas} /></div>
	</div>
</CanvasLayout>
<!-- <Layout collection={data.collections.background_posts} /> -->
