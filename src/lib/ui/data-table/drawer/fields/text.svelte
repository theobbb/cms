<script lang="ts">
	import Textarea from '$lib/ui/form/textarea.svelte';
	import type { FieldProps } from '../field.types';

	const props: FieldProps<'text'> = $props();
</script>

<Textarea {...props} class="w-full border-t-0" />
<!-- <MdEditor {id} {name} {label} {value} {required} /> -->
