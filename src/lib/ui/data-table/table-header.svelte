<script lang="ts">
	import type { Snippet } from 'svelte';

	import Search from '../components/search.svelte';

	const { title, children }: { title: string; children: Snippet } = $props();
</script>

<div class="grid grid-cols-[auto_1fr_auto] items-center gap-3x">
	<div class="">{title}</div>
	<div class="w-full"><Search url_param="search" /></div>

	{@render children()}
</div>
