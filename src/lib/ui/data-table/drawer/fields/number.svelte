<script lang="ts">
	import Input from '$lib/ui/form/input.svelte';
	import type { FieldProps } from '../field.types';

	const { id, name, label, type, required, value }: FieldProps<'number'> = $props();
</script>

<Input {id} {name} {label} {type} {value} {required} />
