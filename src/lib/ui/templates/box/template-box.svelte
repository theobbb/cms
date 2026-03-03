<script lang="ts">
	import Box from '$lib/components/box.svelte';

	const { color, icon, children } = $props();
</script>

<Box {color} class="px-3 py-2 text-sm leading-tight text-balance">
	<div class="flex gap-2">
		<div class={[icon, 'shrink-0 translate-y-0.5']}></div>
		<div>{@render children()}</div>
	</div>
</Box>
