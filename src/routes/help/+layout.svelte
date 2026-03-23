<script lang="ts">
	import Nav from '$lib/components/nav/nav.svelte';

	const { children } = $props();
</script>

<div class="mx-auto my-24 max-w-lg space-y-4x px-4">
	{@render children()}
</div>
