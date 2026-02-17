<script lang="ts">
	import { init_pocketbase } from '$lib/pocketbase';
	// import Header from './header.svelte';
	import { set_app } from '$lib/logic/ctx.svelte';
	import { init_editor } from '$lib/logic/editor.svelte';
	import { set_data_store } from '$lib/logic/data.svelte';
	import { init_header } from '$lib/components/header/header-manager.svelte';
	import Header from '$lib/components/header/header.svelte';

	let { data, children } = $props();
	const { app, server_auth, public_route } = $derived(data);
	//$inspect(app);
	set_app(app);

	const pocketbase = init_pocketbase(app.pocketbase.url, server_auth);

	$effect(() => {
		// This runs whenever `data.auth_cookie` updates (e.g. after your redirect!)
		if (data.server_auth) {
			pocketbase.authStore.loadFromCookie(data.server_auth);
		} else {
			pocketbase.authStore.clear();
		}
	});

	init_editor();
	set_data_store();

	init_header();
</script>

{#if !public_route}
	<Header />
{/if}
{@render children()}
