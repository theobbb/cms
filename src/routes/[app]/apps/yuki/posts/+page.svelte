<script>
	import CanvasInner from '../canvas/canvas-inner.svelte';
	import CanvasLayout from '../canvas/canvas-layout.svelte';
	import { CanvasManager } from '../canvas/canvas-manager.svelte.js';

	const { data } = $props();

	const canvas = new CanvasManager(data.collections.posts);
</script>

<CanvasLayout {canvas}>
	<div
		class="relative col-span-3 col-start-3 mx-auto mt-8 flex w-xl flex-col items-center border bg-surface"
	>
		<CanvasInner {canvas} />
	</div>
</CanvasLayout>
<!-- <Layout collection={data.collections.posts} /> -->
