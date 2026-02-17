<script lang="ts">
	import Textarea from '$lib/ui/form/textarea.svelte';
	import type { FieldProps } from '$config/field.types';

	const { id, name, required, value }: FieldProps<'text'> = $props();
</script>

<Textarea {id} {name} label={name} {value} {required} label_icon="icon-[ri--text]" />
<!-- <MdEditor {id} {name} {label} {value} {required} /> -->
