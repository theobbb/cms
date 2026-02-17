<script lang="ts">
	import Input from '$lib/ui/form/input.svelte';
	import type { FieldProps } from '$config/field.types';

	const { id, name, type, required, value }: FieldProps<'number'> = $props();
</script>

<Input {id} {name} label={name} {type} {value} {required} label_icon="icon-[ri--hashtag]" />
