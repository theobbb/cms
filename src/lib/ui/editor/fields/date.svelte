<script lang="ts">
	import type { FieldProps } from '$config/field.types';
	import DatePicker from '$lib/ui/form/date-picker.svelte';

	const { id, key, title, type, value, required }: FieldProps<'date'> = $props();

	const date = value ? new Date(value) : new Date();
</script>

<DatePicker {id} name={key} label={title} value={date} {required} />
<!-- <Input {id} {name} {label} {type} {value} required={options?.required} /> -->
