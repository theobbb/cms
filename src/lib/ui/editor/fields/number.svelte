<script lang="ts">
	import Input from '$lib/ui/form/input.svelte';
	import type { FieldProps } from '$config/field.types';

	const { id, key, title, type, required, value }: FieldProps<'number'> = $props();
</script>

<Input {id} name={key} label={title} {type} {value} {required} />
