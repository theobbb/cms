<script lang="ts">
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import type { FieldProps } from '$config/field.types';

	let { id, name, type, required, min, max, value = $bindable(0) }: FieldProps<'number'> = $props();
</script>

<Input
	{id}
	{name}
	label={name}
	{type}
	{min}
	{max}
	bind:value
	{required}
	label_icon="icon-[ri--hashtag]"
/>
