<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Anchor from './anchor.svelte';

	const { class: cx, ...props }: ComponentProps<typeof Anchor> = $props();
</script>

<Anchor
	{...props}
	class={[
		cx,
		'tooltip pointer-events-none bg-primary px-1.5 py-0.5 text-xs text-primary-foreground opacity-0 transition duration-100 select-none '
	]}
/>

<style>
	:global([style*='anchor-name']:hover ~ *) {
		opacity: 1;
	}
</style>
