<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="bg-background pointer-events-none invisible absolute border text-sm shadow group-hover/tooltip:visible"
>
	{@render children()}
</div>
