<script lang="ts">
	import Box from '$lib/components/box.svelte';

	const { color, icon, children } = $props();
</script>

<div
	class=" px-3 py-2 text-sm"
	style="background-color: var(--color-{color}); color: var(--color-{color}-foreground);"
>
	<div class="flex gap-2">
		<div class={[icon, 'shrink-0 translate-y-0.5']}></div>
		<div>{@render children()}</div>
	</div>
</div>
