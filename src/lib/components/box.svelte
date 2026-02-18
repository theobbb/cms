<script module>
	type Color =
		| 'background'
		| 'surface'
		| 'primary'
		| 'secondary'
		| 'accent'
		| 'blue'
		| 'green'
		| 'yellow'
		| 'red'
		| 'blue-surface'
		| 'green-surface'
		| 'yellow-surface'
		| 'red-surface';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		color,
		class: cx,
		children
	}: { color: Color; class?: string; children: Snippet } = $props();
</script>

<div
	class={['border', cx]}
	style="background-color: var(--color-{color}); color: var(--color-{color}-foreground); border-color: var(--color-{color}-foreground-muted); --muted: var(--color-{color}-foreground-muted);"
>
	{@render children()}
</div>
