<script lang="ts">
	import Json from '$lib/ui/components/form/fields/json.svelte';
	import type { FieldProps } from '$config/field.types';

	const { id, name, required, value = $bindable(''), label }: FieldProps<'text'> = $props();
</script>

<Json {id} {name} label={label || name} {value} {required}></Json>
