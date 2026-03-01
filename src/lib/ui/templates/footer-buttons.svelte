<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import { get_pop_context, Pop } from '$lib/ui/pop/pop-context.svelte';

	const {
		pop,
		action,
		cancel = 'Cancel'
	}: { pop: Pop; action: string; cancel?: string } = $props();
</script>

<div class="flex items-center justify-end gap-1.5">
	<Button type="reset" onclick={pop.close} size="lg" variant="ghost">{cancel}</Button>
	<Button type="submit" size="lg" variant="action">{action}</Button>
</div>
