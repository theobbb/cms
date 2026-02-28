<script lang="ts">
	import type { Snippet } from 'svelte';
	import { type PopAnchorPosition } from './pop.svelte';
	import Button, { type Props as ButtonProps } from '../button.svelte';
	import { Pop } from './pop-context.svelte';
	import Anchor from './anchor.svelte';
	import Box from '$lib/components/box.svelte';

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

	const id = $props.id();

	const pop = new Pop();
	function close_pop() {
		pop.open = false;
	}

	let container: HTMLElement | null = $state(null);

	function onclick(ev: MouseEvent) {
		ev.stopPropagation();
		pop.toggle();
	}
</script>

<!-- <div class="flex w-full" style="anchor-name: --main-anchor;">
style="position-anchor: --main-anchor; top: anchor(bottom); left: anchor(left); position-try-fallbacks: flip-block;" -->

<div class="relative">
	<Button {onclick} {...props} style="anchor-name: --dropdown-{id};">
		{@render children?.()}
	</Button>

	{#if pop.open}
		<Anchor
			anchor="dropdown-{id}"
			top="bottom"
			left="self-start"
			position_try="flip-inline"
			class="my-2"
		>
			<Box color="surface">
				<div class="flex flex-col">
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
			</Box>
		</Anchor>
	{/if}
</div>
