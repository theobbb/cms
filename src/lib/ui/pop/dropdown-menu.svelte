<script lang="ts">
	import { Pop } from './pop-context.svelte';
	import Anchor, { type AnchorProps } from './anchor.svelte';
	import Box from '$lib/components/box.svelte';

	type Item = { title: string; action: () => void };
	const {
		options,
		children,
		...props
	}: AnchorProps & {
		options: Item[];
	} = $props();

	const pop = new Pop();
</script>

<Anchor {...props}>
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
