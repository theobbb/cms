<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children?: Snippet } = $props();
</script>

<div class="mb-0.5 text-sm text-foreground-muted">
	{@render children?.()}
</div>
