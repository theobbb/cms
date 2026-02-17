<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import type { FieldProps } from '$config/field.types';

	const {
		id,
		name,
		value,
		required,
		type,
		on_extract
		// min_length = 0,
		// max_length = 100
	}: FieldProps<'url'> = $props();

	let sleep: string = $state('');
	let scroll: string = $state('');
</script>

<div class="bg-background">
	<Input
		class={[on_extract && 'border-b-0']}
		{id}
		{name}
		label={name}
		label_icon="icon-[ri--link-m]"
		{type}
		{value}
		{required}
	/>

	{#if on_extract}
		<div class="py-layout-y px-layout-y border border-b-0">
			<div class="grid grid-cols-2 gap-4">
				<Input id="sleep" name="" label="sleep" bind:value={sleep} />
				<Input id="scroll" name="" label="scroll" bind:value={scroll} />
			</div>
		</div>
		<Button
			class="w-full"
			size="lg"
			variant="discrete"
			onclick={() => on_extract(value, Number(sleep), Number(scroll))}
			disabled={!value}>Extraire</Button
		>
	{/if}
</div>
