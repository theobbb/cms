<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	import Label from './label.svelte';

	let {
		name,
		required,
		label,
		placeholder,
		value = $bindable(),
		rows = 8,
		ref = $bindable(null),
		class: class_override,
		...props
	}: HTMLTextareaAttributes & {
		label?: string;
		ref?: any;
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

<div class="bg-background flex flex-col focus-within:ring">
	{#if label}
		<Label {id} required={Boolean(required)} {label} linked />
	{/if}
	<textarea
		{...props}
		{oninput}
		class={[
			'border  px-2.5 py-1.5 placeholder-text/50  outline-none',
			label && 'border-t-0',
			class_override
		]}
		{id}
		{rows}
		{name}
		{required}
		{placeholder}
		bind:value
		bind:this={ref}
	></textarea>
</div>
