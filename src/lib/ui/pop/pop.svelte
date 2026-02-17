<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	export type PopAnchorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

	let {
		onclose,
		anchor = null,
		anchor_position,
		offset = [0, 0],
		children,
		class: cx
	}: {
		onclose: () => void;
		anchor?: HTMLElement | null;
		anchor_position?: PopAnchorPosition;
		offset?: [number, number];
		children: Snippet;
		class?: string;
	} = $props();

	let el: HTMLDivElement | null = null;

	function position() {
		if (!el || !anchor) return;

		const rect = anchor.getBoundingClientRect();
		const pop = el.getBoundingClientRect();

		let top = 0;
		let left = 0;

		switch (anchor_position) {
			case 'top-left':
				top = rect.top - pop.height;
				left = rect.left;
				break;

			case 'top-right':
				top = rect.top - pop.height;
				left = rect.right - pop.width;
				break;

			case 'bottom-right':
				top = rect.bottom;
				left = rect.right - pop.width;
				break;

			case 'bottom-left':
			default:
				top = rect.bottom;
				left = rect.left;
				break;
		}

		el.style.top = `calc(${top}px + ${offset[1]}rem)`;
		el.style.left = `calc(${left}px + ${offset[0]}rem)`;
	}

	function open(el: HTMLDivElement) {
		el.showPopover();
	}

	// onMount(() => {
	// 	if (!el) return;
	// 	el.showPopover();
	// 	position();

	// 	el.addEventListener('toggle', onclose);

	// 	return () => {
	// 		el?.removeEventListener('toggle', onclose);
	// 	};
	// });
</script>

<div use:open popover class="text-font-color bg-background absolute {cx}" {onclose}>
	{@render children()}
</div>
