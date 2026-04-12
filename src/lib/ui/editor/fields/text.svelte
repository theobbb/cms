<script lang="ts">
	import Textarea from '$lib/ui/components/form/fields/textarea.svelte';
	import type { FieldProps } from '$config/field.types';

	let { id, name, required, rows, value = $bindable('') }: FieldProps<'text'> = $props();
</script>

<Textarea {id} {name} label={name} bind:value {rows} {required} label_icon="icon-[ri--text]" />
<!-- <MdEditor {id} {name} {label} {value} {required} /> -->
