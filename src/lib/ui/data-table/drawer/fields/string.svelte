<script lang="ts">
	import Input from '$lib/ui/form/input.svelte';
	import type { FieldProps } from '../field.types';

	const {
		id,
		name,
		label,
		value,
		required,
		type,
		min_length = 0,
		max_length = 100
	}: FieldProps<'string'> = $props();
</script>

<Input {id} {name} {label} {type} {value} {required} />
