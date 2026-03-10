<script lang="ts">
	import { use_form_action } from '$lib/logic/form-action.svelte';

	const {
		label,
		id,
		name,
		required,
		icon,
		linked = false
	}: {
		label: string;
		id: string;
		name?: string | null | undefined;
		required?: boolean;
		icon?: string;
		linked?: boolean;
	} = $props();

	const form_action = use_form_action();

	const error = $derived(name && form_action ? form_action.errors?.[name] : null);
</script>

{#if label}
	<label
		for={id}
		class={[
			linked ? '-mb-0.5 pb-0' : '',
			'bg-surface flex h-8 w-full items-center gap-1 border border-b-0 px-2.5 whitespace-pre lowercase select-none',
			error ? 'text-red-600' : 'text-surface-foreground/70'
		]}
	>
		{#if icon}
			<span class={[icon, 'text-sm']}></span>
		{/if}
		<span class="text-xs font-medium">{label}</span>
		{#if required}
			<span class="-ml-0.5- scale-120 text-red-600">*</span>
		{/if}
	</label>
{/if}
