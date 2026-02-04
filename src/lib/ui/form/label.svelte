<script lang="ts">
	const {
		label,
		id,
		required,
		linked = false
	}: {
		label: string;
		id: string;
		required?: boolean;
		linked?: boolean;
	} = $props();
</script>

{#if label}
	<label
		for={id}
		class={[
			linked ? '-mb-0.5 pb-0' : '',
			'flex w-full border border-b-0 px-2.5 py-1.5 text-xs font-medium whitespace-pre lowercase select-none'
		]}
	>
		<span class="text-text/60">{label}</span>
		{#if required}
			<span class="ml-0.5 scale-110 text-red-700">*</span>
		{/if}
	</label>
{/if}
