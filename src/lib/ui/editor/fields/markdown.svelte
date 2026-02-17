<script lang="ts">
	import Markdown from '$lib/ui/form/markdown.svelte';

	import type { FieldProps } from '$config/field.types';

	const { id, name, required, value }: FieldProps<'markdown'> = $props();
</script>

<!-- <Input {id} {name} {label} {type} {value} {required} /> -->
<Markdown {id} {name} label={name} {value} {required} />
