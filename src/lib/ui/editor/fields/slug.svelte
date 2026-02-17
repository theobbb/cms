<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import { slugify } from '$lib/utils/slugify';
	import type { FieldProps } from '$config/field.types';

	let {
		id,
		name,
		title,
		value,
		required,
		type,
		generate_key,
		generate_compare_collection,
		min_length = 0,
		max_length = 100
	}: FieldProps<'slug'> = $props();

	let container: HTMLDivElement;

	function generate() {
		if (!generate_key) return;
		if (!container) return;

		const input: HTMLInputElement | null =
			container.closest('form')?.querySelector(`input[name="${String(generate_key)}"]`) || null;
		if (!input) return;
		const input_value = input.value;
		if (!input_value) return;
		value = slugify(input_value);
	}
</script>

<div bind:this={container}>
	<Input
		{id}
		name={key}
		label={title}
		{type}
		{value}
		{required}
		class={[generate_key && 'border-b-0']}
	/>
	{#if generate_key}
		<Button class="w-full" size="lg" variant="discrete" onclick={generate}>Générer</Button>
	{/if}
</div>
