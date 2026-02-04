<script lang="ts">
	// import MdEditor from '$lib/ui/form/md-editor.svelte';

	import type { FieldProps } from '../field.types';

	const { id, name, label, type, required, value }: FieldProps<'markdown'> = $props();
</script>

<!-- <Input {id} {name} {label} {type} {value} {required} /> -->
<!-- <MdEditor {id} {name} {label} {value} {required} /> -->
