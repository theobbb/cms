<script lang="ts">
	import Textarea from '$lib/ui/form/textarea.svelte';
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
	}: FieldProps<'text'> = $props();
</script>

<Textarea name={key} label={title} {value} {required} class="w-full border-t-0" />
<!-- <MdEditor {id} {name} {label} {value} {required} /> -->
