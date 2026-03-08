<script lang="ts">
	import type { FieldProps } from '$config/field.types';
	import Switch from '$lib/ui/components/form/fields/switch.svelte';

	let { id, name, label, value }: FieldProps<'bool'> = $props();
</script>

<Switch {id} {name} label={label || name} checked={value} />
