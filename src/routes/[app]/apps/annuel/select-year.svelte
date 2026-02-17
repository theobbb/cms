<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/button.svelte';
	import Pop from '$lib/ui/pop/pop.svelte';

	const year = $derived(page.params.year);
	let pop_open = $state(false);
</script>

<div class="fixed bottom-gap-y left-gap">
	<div class="relative">
		{#if pop_open}
			<Pop onclose={() => (pop_open = false)}>ss</Pop>
		{/if}
		<Button onclick={() => (pop_open = true)}>{year}</Button>
	</div>
</div>
