<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children?: Snippet } = $props();
</script>

<div class="mb-0.5 px-2.5 text-sm text-muted">
	{@render children?.()}
</div>
