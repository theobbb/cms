<script lang="ts">
	import Button, { type ButtonVariant } from '$lib/ui/components/button.svelte';

	const {
		confirm = 'Confirmer',
		cancel = 'Annuler',
		variant = 'action',
		onclose
	}: {
		confirm?: string;
		cancel?: string;
		variant?: ButtonVariant;
		onclose?: () => void;
	} = $props();
</script>

<div class="flex items-center justify-end gap-1.5">
	<Button type="reset" onclick={onclose} size="lg" variant="ghost">{cancel}</Button>
	<Button type="submit" size="lg" {variant}>{confirm}</Button>
</div>
