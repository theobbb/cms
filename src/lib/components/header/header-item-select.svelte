<script lang="ts">
	import type { HeaderItem } from './header-manager.svelte';

	const { item }: { item: HeaderItem & { options: string[] } } = $props();

	let pop_open = $state(false);
</script>

<button onclick={() => (pop_open = true)}>
	{item.name}
</button>
