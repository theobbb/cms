<script lang="ts">
	import Textarea from '$lib/ui/form/textarea.svelte';
	import type { FieldProps } from '$config/field.types';

	const props: FieldProps<'text'> = $props();
</script>

<Textarea {...props} />
<!-- <MdEditor {id} {name} {label} {value} {required} /> -->
