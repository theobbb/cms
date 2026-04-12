<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Label from '../label.svelte';
	import Error from '../error.svelte';
	import { use_form_action } from '$lib/logic/form-action.svelte';

	let {
		type = 'text',
		name,
		label = '',
		label_icon,

		required,
		value = $bindable(),
		...props
	}: HTMLInputAttributes & { label?: string; label_icon?: string } = $props();

	const props_id = $props.id();
	const id = $derived(props.id || name || props_id);

	const form_action = use_form_action();
	function oninput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (name) form_action?.clear_error(name);
		if (props.oninput) props.oninput(event);
	}
</script>

<div>
	<div class="flex flex-col bg-surface text-surface-foreground ring-accent focus-within:ring-2">
		<Label {id} {name} required={Boolean(required)} {label} icon={label_icon} linked />

		<input
			{...props}
			{oninput}
			{required}
			{name}
			{type}
			class={[
				'border px-2.5 py-1.5 placeholder-surface-foreground/50 outline-none',
				label && '-mt-1.5 border-t-0',
				props.class
			]}
			{id}
			autocomplete="off"
			bind:value
		/>
	</div>
	<Error {name} />
</div>
