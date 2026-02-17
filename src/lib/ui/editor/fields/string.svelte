<script lang="ts">
	import Input from '$lib/ui/form/input.svelte';
	import type { FieldProps } from '$config/field.types';
	import Text from './text.svelte';

	const props: FieldProps<'text'> = $props();

	const label_icon = $derived(props.type == '');
</script>

{#if 'rows' in props}
	<Text {...props} />
{:else}
	<Input {...props} label={props.name} label_icon="icon-[ri--text]" />
{/if}
