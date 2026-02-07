<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Label from './label.svelte';

	let {
		id,
		name,
		type = 'text',
		label = '',
		required = false,
		value = $bindable(),
		...props
	}: HTMLInputAttributes & { label?: string } = $props();
</script>

<div class="bg-background flex flex-col ring-text focus-within:ring">
	<Label id={id || name || String(Math.random())} required={Boolean(required)} {label} linked />

	<input
		class={[
			'border px-2.5 py-1.5 placeholder-text/50 ring-text/20 outline-none',
			label && 'border-t-0',
			props.class
		]}
		{id}
		{type}
		{name}
		{required}
		bind:value
	/>
</div>
