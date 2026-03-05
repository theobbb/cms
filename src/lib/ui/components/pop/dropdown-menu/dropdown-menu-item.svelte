<script module>
	import type { ClassValue } from 'svelte/elements';
	import { get_pop_context, Pop } from '../pop-context.svelte';

	type BaseItem = { label: string; icon?: string; class?: ClassValue; disabled?: boolean };

	export type DropdownMenuItem =
		| ({ type: 'button'; action: (() => void) | (() => Promise<void>) } & BaseItem)
		| ({ type: 'link'; href: string } & BaseItem)
		| { type: 'divider' };
</script>

<script lang="ts">
	import Button from '../../button.svelte';

	const {
		item,
		pop: manual_pop
	}: {
		item: DropdownMenuItem;
		pop?: Pop;
	} = $props();

	const pop = manual_pop || get_pop_context();
</script>

{#if item.type == 'divider'}
	<div class="my-1 border-t"></div>
{:else}
	<Button
		class={[item.class, 'hover:bg-secondary mx-1 justify-start']}
		variant="none"
		href={item.type == 'link' ? item.href : undefined}
		icon={item.icon}
		disabled={item.disabled}
		onclick={() => {
			pop.close();
			if (item.type == 'button') item.action();
		}}
	>
		{item.label}
	</Button>
{/if}
