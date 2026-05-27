<script lang="ts">
	import Json from '$lib/ui/components/form/fields/json.svelte';
	import type { FieldProps } from '$config/field.types';

	const { id, name, required, value = $bindable(''), label_props }: FieldProps<'text'> = $props();
</script>

<Json {name} {value} {required} {...label_props}></Json>
