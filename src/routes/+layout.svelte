<script lang="ts">
	import '$lib/style/layout.css';

	import favicon from '$lib/assets/favicon.svg';

	import { init_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import Toaster from '$lib/components/toaster/toaster.svelte';
	import DialogConfirm from '$lib/ui/templates/dialog-confirm.svelte';
	import { init_theme } from '$lib/logic/theme.svelte.js';
	import ThemeHead from '$lib/theme-head.svelte';
	import { dev } from '$app/environment';
	import Dev from '$lib/dev.svelte';

	let { data, children } = $props();

	init_toaster();
	init_theme(data.theme);
</script>

<ThemeHead />

<div class="text-base">
	{@render children()}
	<Toaster />
	<DialogConfirm />
</div>

{#if dev}
	<Dev />
{/if}

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
