<script lang="ts">
	type AnchorSide =
		| 'top'
		| 'right'
		| 'bottom'
		| 'left'
		| 'inside'
		| 'outside'
		| 'start'
		| 'end'
		| 'self-start'
		| 'self-end'
		| 'center'
		| `${number}%`;

	import { type Snippet } from 'svelte';

	type PositionTryFallbacks = 'none' | `${'flip-block' | 'flip-inline' | 'flip-start'}${string}`;

	let {
		anchor,
		top = 'bottom',
		left = 'end',
		position_try = 'flip-block',
		children,
		class: cx
	}: {
		anchor: string;
		top: AnchorSide;
		left: AnchorSide;
		position_try?: PositionTryFallbacks;
		children: Snippet;
		class?: string;
	} = $props();

	//const [anchor_y, anchor_x] = $derived(position?.split('-') || []);
</script>

<div
	class="fixed z-50 {cx}"
	style="position-anchor: --{anchor}; top: anchor({top}); left: anchor({left}); position-try: {position_try};"
>
	{@render children()}
</div>
