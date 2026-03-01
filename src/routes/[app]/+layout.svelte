<script lang="ts">
	import { init_pocketbase } from '$lib/pocketbase';
	import { set_app } from '$lib/logic/ctx.svelte';
	import { init_editor } from '$lib/ui/editor/editor-context.svelte';
	import { init_header } from '$lib/components/header/header-manager.svelte';
	import Header from './header.svelte';

	let { data, children } = $props();
	const { app, server_auth, public_route } = $derived(data);

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

	init_header();
</script>

{#if !public_route}
	<Header />
{/if}
{@render children()}
