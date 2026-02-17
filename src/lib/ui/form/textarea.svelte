<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	import Label from './label.svelte';

	let {
		name,
		required,
		label,
		label_icon,
		placeholder,
		value = $bindable(),
		rows = 6,

		ref = $bindable(null),
		class: class_override,
		min,
		max,
		...props
	}: HTMLTextareaAttributes & {
		label?: string;
		ref?: any;
		min?: number;
		max?: number;
		label_icon?: string;
	} = $props();

	const props_id = $props.id();

	function oninput(event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) {
		let textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto'; // reset
		const scroll_height = textarea.scrollHeight + 50;
		textarea.style.height = scroll_height + 'px';

		if (typeof props.oninput == 'function') props.oninput(event);
	}

	const id = $derived(props.id || name || props_id);
</script>

<div class="flex flex-col bg-surface text-surface-foreground ring-accent focus-within:ring-2">
	{#if label}
		<Label {id} required={Boolean(required)} {label} icon={label_icon} linked />
	{/if}
	<textarea
		{oninput}
		class={[
			'bg-bg-2 placeholder-text/50 border px-2.5 py-1.5  outline-none',
			label && 'border-t-0',
			class_override
		]}
		{id}
		{rows}
		{name}
		{required}
		{placeholder}
		minlength={min}
		maxlength={max}
		bind:value
		bind:this={ref}
	></textarea>
</div>
