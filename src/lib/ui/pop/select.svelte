<script lang="ts">
	import type { Snippet } from 'svelte';
	import Pop from './pop.svelte';
	import Button, { type Props as ButtonProps } from '../button.svelte';

	const {
		pop_offset = [0, 0],
		pop_position,
		options,
		children,
		...props
	}: ButtonProps & {
		pop_offset?: [number, number];
		pop_position?: PopAnchorPosition;
		options: { title: string; action: () => void }[];
		children?: Snippet;
	} = $props();

	const pop = $state({ open: false });
	function close_pop() {
		pop.open = false;
	}

	let container: HTMLElement | null = $state(null);

	function onclick(ev: MouseEvent) {
		ev.stopPropagation();
		pop.open = !pop.open;
	}
</script>

<div bind:this={container} class="relative">
	<Button {onclick} {...props}>
		{@render children?.()}
	</Button>

	{#if pop.open}
		<Pop onclose={close_pop} anchor={container} anchor_position={pop_position} offset={pop_offset}>
			<div class="bg-bg z-100 flex max-w-200 flex-col border">
				{#each options as { title, action }}
					<button
						class="hover:bg-text/10 border-b px-4 py-1.5 text-left font-medium transition duration-100 last:border-b-0"
						onclick={() => {
							close_pop();
							action();
						}}
						type="button"
					>
						{title}
					</button>
				{/each}
			</div>
		</Pop>
	{/if}
</div>
