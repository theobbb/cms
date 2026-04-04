<script lang="ts">
	import { apps } from '$config/apps';
	import { set_app } from '$lib/logic/ctx.svelte';
	import { init_pocketbase } from '$lib/pocketbase';
	import Header from './header.svelte';

	const { children } = $props();

	set_app(apps.annuel);
	init_pocketbase(apps.annuel.pocketbase.url, '');
</script>

<div class="mx-auto my-12 max-w-2xl space-y-12 px-4">
	<Header />
	{@render children()}
</div>
