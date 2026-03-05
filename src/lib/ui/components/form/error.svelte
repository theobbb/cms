<script lang="ts">
	import { use_form_action } from '$lib/logic/form-action.svelte';

	const { name }: { name: string | null | undefined } = $props();

	const form_action = use_form_action();

	const error = $derived(name && form_action ? form_action.errors?.[name] : null);
</script>

{#if error}
	<div class="my-1.5 text-xs text-red-600">
		{error.message}
	</div>
{/if}
