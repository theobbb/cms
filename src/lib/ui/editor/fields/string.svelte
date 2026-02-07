<script lang="ts">
	import Input from '$lib/ui/form/input.svelte';
	import type { FieldProps } from '$config/field.types';
	import Text from './text.svelte';

	const props: FieldProps<'text'> = $props();
</script>

{#if props.rows}
	<Text {...props} label={props.name} />
{:else}
	<Input {...props} label={props.name} />
{/if}
