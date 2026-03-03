<script module>
	import { type Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type SharedSide =
		| 'inside'
		| 'outside'
		| 'start'
		| 'end'
		| 'self-start'
		| 'self-end'
		| 'center'
		| `${number}%`;
	type BlockSide = SharedSide | 'top' | 'bottom';
	type InlineSide = SharedSide | 'left' | 'right';

	type AnchorPositionTryFallbacks = 'flip-block' | 'flip-inline' | 'flip-start';

	export type AnchorProps = {
		anchor: string;
		top?: BlockSide;
		bottom?: BlockSide;
		left?: InlineSide;
		right?: InlineSide;
		position_try?: AnchorPositionTryFallbacks;
		children?: Snippet;
		class?: ClassValue;
	};
</script>

<script lang="ts">
	const {
		anchor,
		top,
		bottom,
		left,
		right,
		position_try = 'flip-block',
		children,
		class: cx
	}: AnchorProps = $props();

	const style = $derived(
		[
			`position-anchor: ${anchor}`,
			top ? `top: anchor(${top})` : '',
			bottom ? `bottom: anchor(${bottom})` : '',
			left ? `left: anchor(${left})` : '',
			right ? `right: anchor(${right})` : '',
			`position-try: ${position_try}`
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<div class={[cx, 'fixed z-50']} {style}>
	{@render children?.()}
</div>
