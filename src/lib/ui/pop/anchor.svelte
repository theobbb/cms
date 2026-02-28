<script module>
	import { type Snippet } from 'svelte';

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

	type AnchorPositionTryFallbacks = 'flip-block' | 'flip-inline' | 'flip-start';

	export type AnchorProps = {
		anchor: string;
		top?: AnchorSide;
		left?: AnchorSide;
		position_try?: AnchorPositionTryFallbacks;
		children?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	let {
		anchor,
		top = 'bottom',
		left = 'end',
		position_try = 'flip-block',
		children,
		class: cx
	}: AnchorProps = $props();

	//const [anchor_y, anchor_x] = $derived(position?.split('-') || []);
</script>

<div
	class="fixed z-50 {cx}"
	style="position-anchor: --{anchor}; top: anchor({top}); left: anchor({left}); position-try: {position_try};"
>
	{@render children?.()}
</div>
