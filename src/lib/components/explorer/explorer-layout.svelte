<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		n_nav = 0,
		header,
		table,
		drawer
	}: { n_nav?: number; header: Snippet; table: Snippet; drawer: Snippet } = $props();
</script>

<div
	class="-mb-layout-y flex h-screen max-w-dvw flex-col"
	style="height: calc(100svh - var(--spacing-layout-y) - {n_nav} * var(--spacing-nav-h));"
>
	<header class=" h-nav-h flex justify-between">
		{@render header?.()}
	</header>

	<div class="-mx-layout-x pl-layout-x flex h-full justify-between">
		<div class="-ml-layout-x overflow-x-auto">
			{@render table?.()}
		</div>
		<div class="w-drawer mt-1.5">
			{@render drawer?.()}
		</div>
	</div>
</div>
