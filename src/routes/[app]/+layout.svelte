<script lang="ts">
	import '$lib/style/layout.css';
	import '$lib/style/fonts.css';
	import { init_pocketbase } from '$lib/pocketbase';
	import Header from './header.svelte';
	import { set_app } from '$lib/logic/ctx.svelte';
	import { init_editor } from '$lib/logic/editor.svelte';

	let { data, children } = $props();
	const { app, server_auth, public_route } = $derived(data);
	$inspect(app);
	init_pocketbase(app.pocketbase.url, server_auth);

	set_app(app);
	init_editor();
</script>

{#if !public_route}
	<Header />
{/if}
{@render children()}
