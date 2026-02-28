<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Label from './label.svelte';

	let {
		type = 'text',
		label = '',
		label_icon,
		required = false,
		placeholder,
		value = $bindable(),
		...props
	}: HTMLInputAttributes & { label?: string; label_icon?: string } = $props();

	const props_id = $props.id();
	const id = $derived(props.id || props.name || props_id);

	$inspect(id);
</script>

<div class="bg-surface text-surface-foreground ring-accent flex flex-col focus-within:ring-2">
	<Label {id} required={Boolean(required)} {label} icon={label_icon} linked />

	<input
		{...props}
		class={[
			'placeholder-surface-foreground/50 border px-2.5 py-1.5 outline-none',
			label && '-mt-1.5 border-t-0',
			props.class
		]}
		{id}
		autocomplete="off"
		bind:value
	/>
</div>
