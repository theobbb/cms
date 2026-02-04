<script lang="ts">
	import Input from '$lib/ui/form/input.svelte';
	import type { FieldProps } from '$config/field.types';

	const {
		id,
		key,
		title,
		value,
		required,
		type,
		min_length = 0,
		max_length = 100
	}: FieldProps<'string'> = $props();
</script>

<Input {id} name={key} label={title} {type} {value} {required} />
