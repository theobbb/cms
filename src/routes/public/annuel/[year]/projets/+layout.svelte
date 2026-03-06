<script lang="ts">
	import { set_collection } from '$lib/logic/ctx.svelte';

	const { data, children } = $props();

	set_collection(data.collections.projects);
</script>

{@render children()}
