<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Label from '../label.svelte';
	import Error from '../error.svelte';
	import { use_form_action } from '$lib/logic/form-action.svelte';
	import Tooltip from '../../pop/tooltip.svelte';

	let {
		name,
		label = '',
		required,
		value = $bindable(''),
		...props
	}: HTMLAttributes<HTMLPreElement> & {
		name?: string;
		label?: string;
		value?: string;
		required?: boolean;
	} = $props();

	const props_id = $props.id();
	const id = $derived(props.id || name || props_id);

	const form_action = use_form_action();

	function format_json(val: any): string {
		if (val === null || val === undefined || val === '') return '';
		if (typeof val === 'object') {
			return JSON.stringify(val, null, 2);
		}
		try {
			const cleaned =
				typeof val === 'string'
					? val.replace(/\u00A0/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '')
					: String(val);
			return JSON.stringify(JSON.parse(cleaned), null, 2);
		} catch {
			return typeof val === 'string' ? val : String(val);
		}
	}

	// Internal display string — always a formatted string, never a raw object
	let display = $state(format_json(value));
	$effect(() => {
		display = format_json(value);
	});
	function oninput(event: Event & { currentTarget: EventTarget & HTMLPreElement }) {
		const raw = (event.currentTarget as HTMLPreElement).textContent ?? '';
		value = raw; // propagate raw string upward

		if (name) form_action?.clear_error(name);
		if (props.oninput) props.oninput(event);
	}

	function onblur(event: FocusEvent & { currentTarget: EventTarget & HTMLPreElement }) {
		const formatted = format_json(display);
		display = formatted;
		value = formatted;

		if (props.onblur) props.onblur(event);
	}
	const is_valid = $derived.by(() => {
		try {
			JSON.parse(display);
			return true;
		} catch {
			return false;
		}
	});
</script>

<div>
	<div
		class="relative flex flex-col bg-surface text-surface-foreground ring-accent focus-within:ring-2"
	>
		<Label {id} {name} required={Boolean(required)} {label} icon="icon-[ri--braces-fill]" linked />
		<pre
			{...props}
			contenteditable="true"
			{id}
			class={[
				'min-h-24 overflow-auto border px-2.5 py-1.5 font-mono text-xs whitespace-pre-wrap outline-none',
				label && '-mt-1.5 border-t-0',
				props.class
			]}
			bind:textContent={display}
			{oninput}
			{onblur}
			role="textbox"
			tabindex="0"></pre>
		{#if name}
			<input type="hidden" {name} value={display} />
		{/if}
		{#if display}
			<div
				class={[
					'peer absolute top-2 right-2',
					is_valid
						? 'icon-[ri--checkbox-circle-fill] bg-green-500'
						: 'icon-[ri--close-circle-fill] bg-red-500'
				]}
				style="anchor-name: --anchor-json-{props_id};"
			></div>
			<Tooltip anchor="--anchor-json-{props_id}" right="left" top="top" class="-mt-0.5 mr-1">
				{is_valid ? 'JSON valide' : 'JSON invalide'}
			</Tooltip>
		{/if}
	</div>
	<Error {name} />
</div>
