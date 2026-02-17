<script>
	import Button from '$lib/ui/button.svelte';

	const { action, cancel = 'Cancel', onclose } = $props();
</script>

<div class="flex items-center justify-end gap-1.5">
	<Button type="reset" onclick={onclose} size="lg" variant="ghost">{cancel}</Button>
	<Button type="submit" size="lg" variant="action">{action}</Button>
</div>
