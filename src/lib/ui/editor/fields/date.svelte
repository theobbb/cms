<script lang="ts">
	import type { FieldProps } from '$config/field.types';
	import DatePicker from '$lib/ui/form/date-picker.svelte';

	const { id, name, value, required }: FieldProps<'date'> = $props();

	const date = $derived(value ? new Date(value) : new Date());
</script>

<DatePicker {id} {name} label={name} value={date} {required} />
<!-- <Input {id} {name} {label} {type} {value} required={options?.required} /> -->
