<script lang="ts">
	import { set_collection } from '$lib/logic/ctx.svelte';
	import type { LayoutProps } from './$types';

	const { data, children }: LayoutProps = $props();

	set_collection(data.collections.projects);
</script>

{@render children()}
