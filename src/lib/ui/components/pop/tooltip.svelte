<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Anchor from './anchor.svelte';

	const { class: cx, ...props }: ComponentProps<typeof Anchor> = $props();
</script>

<Anchor
	{...props}
	class={[
		cx,
		'pointer-events-none bg-primary px-1.5 py-0.5 text-xs text-primary-foreground transition duration-100 select-none not-peer-hover:opacity-0'
	]}
/>
