<script lang="ts">
	import { init_pocketbase } from '$lib/pocketbase';
	import { set_app } from '$lib/logic/ctx.svelte';
	import { init_header } from '$lib/components/header/header-manager.svelte';
	import Header from './header.svelte';
	import { init_copy } from '$lib/copy/index.js';

	let { data, children } = $props();
	const { app, server_auth, public_route } = $derived(data);

	set_app(app);
	init_copy(app.lang);

	const pocketbase = init_pocketbase(app.pocketbase.url, server_auth);

	$effect(() => {
		if (data.server_auth) {
			pocketbase.authStore.loadFromCookie(data.server_auth);
		} else {
			pocketbase.authStore.clear();
		}
	});

	init_header();
</script>

{#if !public_route}
	<Header />
{/if}
{@render children()}

<svelte:head>
	<title>{app.title} - Atelier</title>
</svelte:head>
