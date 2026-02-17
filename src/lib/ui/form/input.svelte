<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Label from './label.svelte';

	let {
		id,
		name,
		type = 'text',
		label = '',
		label_icon,
		required = false,
		placeholder,
		value = $bindable(),
		...props
	}: HTMLInputAttributes & { label?: string; label_icon?: string } = $props();
</script>

<div class="flex flex-col bg-surface text-surface-foreground ring-accent focus-within:ring-2">
	<Label
		id={id || name || String(Math.random())}
		required={Boolean(required)}
		{label}
		icon={label_icon}
		linked
	/>

	<input
		class={[
			'placeholder-text/50 border px-2.5 py-1.5 outline-none',
			label && 'border-t-0',
			props.class
		]}
		{id}
		{type}
		{name}
		{required}
		{placeholder}
		bind:value
	/>
</div>
