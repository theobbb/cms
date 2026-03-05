<script lang="ts">
	import { use_form_action } from '$lib/logic/form-action.svelte';
	import Button from '$lib/ui/components/button.svelte';

	let {
		name,
		label,
		checked = $bindable(false),
		...props
	}: {
		id?: string;
		name?: string;
		label?: string;
		checked?: boolean;
		onchange?: (value: boolean) => void;
	} = $props();

	const props_id = $props.id();

	const id = $derived(props.id || props_id);

	function toggle() {
		checked = !checked;
		props.onchange?.(checked);
	}

	const form_action = use_form_action();

	$effect(() => {
		if (!name) return;
		const unregister = form_action?.register_hook(async ({ form_data, cancel }) => {
			console.log('hook from switch');
			form_data.set(name, String(checked));
		});
		return unregister;
	});
</script>

<div class="flex items-center gap-2">
	<input class="hidden" {id} type="checkbox" {name} bind:checked />
	<Button
		onclick={toggle}
		variant="none"
		class="text-2xl!"
		icon={checked ? 'icon-[ri--toggle-fill]' : 'icon-[ri--toggle-line]'}
	></Button>
	{#if label}
		<label class="select-none" for={id}>{label}</label>
	{/if}
</div>
