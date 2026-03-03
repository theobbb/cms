<script lang="ts">
	import type { Snippet } from 'svelte';

	import Button from '$lib/ui/styled/button.svelte';
	import { Pop } from '../primitives/pop/pop-context.svelte';
	import Anchor from '../primitives/pop/anchor.svelte';
	import Box from '$lib/components/box.svelte';

	type Option = { label: string; value: string; disabled?: boolean };

	let {
		value = $bindable(''),
		options,
		type = 'single',
		placeholder = 'Select',
		name
	}: {
		value: string;
		options: Option[];
		type?: 'single' | 'multiple';
		name?: string;
		placeholder?: string;
	} = $props();
	const props_id = $props.id();

	const pop = new Pop();

	function select(option: Option) {
		value = option.value;
		if (type == 'single') pop.close();
	}
</script>

<div>
	<Button
		onclick={pop.toggle}
		class="justify-start"
		style="anchor-name: --select-{props_id};"
		variant="none"
	>
		<div class="flex w-full items-center justify-between">
			{placeholder}
			<span class="icon-[ri--arrow-down-s-line]"></span>
		</div>
	</Button>
	<div>
		{#if pop.open}
			<Anchor anchor="--select-{props_id}" class="my-1.5">
				<Box color="surface">
					<div class="my-1 flex flex-col gap-0.5">
						{#each options as option}
							<Button
								class={[
									'mx-1 justify-start border-0 px-2',
									value == option.value ? 'bg-accent' : ''
								]}
								variant="ghost"
								onclick={() => select(option)}
							>
								{option.label}
							</Button>
						{/each}
					</div>
				</Box>
			</Anchor>
		{/if}
	</div>
</div>
{#if name}
	<input {name} {value} type="hidden" />
{/if}
