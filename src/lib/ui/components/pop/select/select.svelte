<script module>
	export type SelectOption = { label: string; value: string; disabled?: boolean };
</script>

<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '../pop-context.svelte';
	import Anchor from '../anchor.svelte';
	import Box from '$lib/components/box.svelte';

	let {
		value = $bindable(''),
		options,
		type = 'single',
		placeholder = 'Select',
		name,
		onchange
	}: {
		value: string;
		options: SelectOption[];
		type?: 'single' | 'multiple';
		name?: string;
		placeholder?: string;
		onchange?: (option: SelectOption) => void;
	} = $props();
	const props_id = $props.id();

	const pop = new Pop();

	function select(option: SelectOption) {
		value = option.value;
		if (type == 'single') pop.close();
		onchange?.(option);
	}

	const selected = $derived(options.find((o) => o.value === value));
</script>

<div class="@container relative w-48">
	<Button
		onclick={pop.toggle}
		class="w-full  justify-start border! bg-surface py-1 text-surface-foreground"
		style="anchor-name: --select-{props_id};"
	>
		<div class="flex w-full items-center justify-between gap-2">
			{#if selected}
				{selected.label}
			{:else}
				<span class="text-muted">{placeholder}</span>
			{/if}
			<span class="icon-[ri--arrow-down-s-line] shrink-0"></span>
		</div>
	</Button>
	<div>
		{#if pop.open}
			<Anchor anchor="--select-{props_id}" class="my-1.5">
				<Box color="surface">
					<div class="my-1 flex min-w-[100cqw] flex-col gap-0.5">
						{#each options as option}
							<Button
								class={[
									'mx-1 justify-start border-0 px-2',
									value == option.value ? 'bg-accent' : ''
								]}
								variant="ghost"
								onclick={() => select(option)}
								disabled={option.disabled}
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
