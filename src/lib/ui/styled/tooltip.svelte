<script lang="ts">
	import type { AnchorProps } from '../primitives/pop/anchor.svelte';
	import Anchor from '../primitives/pop/anchor.svelte';

	const { class: cx, ...props }: AnchorProps = $props();
</script>

<Anchor
	{...props}
	class={[
		cx,
		'bg-primary text-primary-foreground pointer-events-none px-1.5 py-0.5 text-xs opacity-0 transition duration-100 select-none peer-hover:opacity-100'
	]}
/>
