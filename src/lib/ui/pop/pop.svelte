<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { Pop } from './pop-context.svelte';

	export type PopAnchorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

	let {
		pop,
		onclose,
		anchor = null,
		anchor_position = 'bottom-left',
		offset = [0, 0],
		children,
		class: cx
	}: {
		pop: Pop;
		onclose: () => void;
		anchor?: HTMLElement | null;
		anchor_position?: PopAnchorPosition;
		offset?: [number, number];
		children: Snippet;
		class?: string;
	} = $props();

	const [anchor_y, anchor_x] = $derived(anchor_position?.split('-') || []);
</script>

<div
	class="fixed z-50 {cx}"
	{onclose}
	style="position-anchor: --main-anchor; top: anchor({anchor_y}); left: anchor({anchor_x}); position-try-fallbacks: flip-block;"
>
	{@render children()}
</div>

<!-- <div use:open popover class="text-font-color bg-background absolute {cx}" {onclose}>
	{@render children()}
</div> -->
