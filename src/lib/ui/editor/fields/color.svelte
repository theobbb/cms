<script lang="ts">
	import type { FieldProps } from '$config/field.types';
	import Label from '$lib/ui/components/form/label.svelte';

	let { id, name, value = $bindable(), label, required }: FieldProps<'color'> = $props();
</script>

<Label {id} label={label || name || ''} icon="icon-[ri--color-filter-line]" />

<div class="flex">
	<input class="size-6 rounded-full border-0 outline-0" type="color" {id} {name} {value} />
</div>
