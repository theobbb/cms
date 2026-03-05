<script module>
	import Box from '$lib/components/box.svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { AnchorProps } from '../anchor.svelte';
	import Anchor from '../anchor.svelte';
	import { Pop } from '../pop-context.svelte';

	type BaseItem = { label: string; icon?: string; class?: ClassValue; disabled?: boolean };

	type Item =
		| ({ type: 'button'; action: () => void } & BaseItem)
		| ({ type: 'link'; href: string } & BaseItem)
		| { type: 'divider' };
</script>

<script lang="ts">
	import Popover from '../popover.svelte';
	import Button from '../../button.svelte';

	const {
		pop,
		options,
		children,
		...props
	}: AnchorProps & {
		pop: Pop;
		options: Item[];
	} = $props();
</script>

<Popover {pop}>
	<Anchor {...props}>
		<Box color="surface">
			<div class="my-1 flex flex-col">
				{#each options as option}
					{#if option.type == 'divider'}
						<div class="my-1 border-t"></div>
					{:else}
						<Button
							class={[option.class, 'hover:bg-secondary mx-1 justify-start']}
							variant="none"
							href={option.type == 'link' ? option.href : undefined}
							icon={option.icon}
							disabled={option.disabled}
							onclick={() => {
								pop.close();
								if (option.type == 'button') option.action();
							}}
						>
							{option.label}
						</Button>
					{/if}
				{/each}
			</div>
		</Box>
	</Anchor>
</Popover>
