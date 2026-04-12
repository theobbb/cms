<script lang="ts">
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import type { FieldProps } from '$config/field.types';
	import Text from './text.svelte';
	import type { RecordModel } from 'pocketbase';

	const {
		record,
		system,
		pattern,
		autogeneratePattern,
		presentable,
		min,
		max,
		...props
	}: FieldProps<'text'> & {
		record: RecordModel;
	} = $props();

	//const label_icon = $derived(props.type == '');
</script>

{#if 'rows' in props}
	<Text {...props} />
{:else}
	<Input
		{...props}
		minlength={Boolean(Number(min)) ? Number(min) : undefined}
		maxlength={Boolean(Number(max)) ? Number(max) : undefined}
		label={props.label || props.name}
		label_icon="icon-[ri--text]"
	/>
{/if}
