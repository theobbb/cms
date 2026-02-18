<script lang="ts">
	import '$lib/style/layout.css';
	import '$lib/style/fonts.css';
	import '$lib/style/colors.css';
	import '$lib/style/typo.css';

	import '$lib/style/markdown.css';
	import favicon from '$lib/assets/favicon.svg';

	import { init_toaster } from '$lib/logic/toaster.svelte';
	import Toaster from '$lib/components/toaster/toaster.svelte';
	import DialogConfirm from '$lib/components/dialog-confirm.svelte';

	let { data, children } = $props();
	// $inspect(data);
	init_toaster();
</script>

<div class="">
	{@render children()}
	<Toaster />
	<DialogConfirm />
</div>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- <link rel="icon" href="data:," /> -->
</svelte:head>
