<script lang="ts">
	import Button, { type Props as ButtonProps } from '../button.svelte';
	import { Pop } from './pop-context.svelte';
	import Anchor, { type AnchorProps } from './anchor.svelte';
	import Box from '$lib/components/box.svelte';

	const {
		top,
		left,
		position_try,
		options,
		children,
		...props
	}: ButtonProps &
		AnchorProps & {
			options: { title: string; action: () => void }[];
		} = $props();

	const id = $props.id();

	const pop = new Pop();

	function onclick(ev: MouseEvent) {
		ev.stopPropagation();
		pop.toggle();
	}
</script>

<div>
	<Button {onclick} {...props} style="anchor-name: --dropdown-{id};">
		{@render children?.()}
	</Button>

	{#if pop.open}
		<Anchor anchor="dropdown-{id}" {top} {left} {position_try} class="my-2">
			<Box color="surface">
				<div class="flex flex-col">
					{#each options as { title, action }}
						<button
							class="hover:bg-text/10 border-b px-4 py-1.5 text-left font-medium transition duration-100 last:border-b-0"
							onclick={() => {
								pop.close();
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
