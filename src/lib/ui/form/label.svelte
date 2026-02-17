<script lang="ts">
	const {
		label,
		id,
		required,
		icon,
		linked = false
	}: {
		label: string;
		id: string;
		required?: boolean;
		icon?: string;
		linked?: boolean;
	} = $props();
</script>

{#if label}
	<label
		for={id}
		class={[
			linked ? '-mb-0.5 pb-0' : '',
			'flex h-8 w-full items-center gap-1 border border-b-0 px-2.5 whitespace-pre lowercase select-none'
		]}
	>
		{#if icon}
			<span class={[icon, 'text-sm']}></span>
		{/if}
		<span class="text-text/60 text-xs font-medium">{label}</span>
		{#if required}
			<span class="-ml-0.5- scale-120 text-red-600">*</span>
		{/if}
	</label>
{/if}
