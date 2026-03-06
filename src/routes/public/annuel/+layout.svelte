<script lang="ts">
	import { page } from '$app/state';
	import { apps } from '$config/apps';
	import { set_app } from '$lib/logic/ctx.svelte';
	import { init_pocketbase } from '$lib/pocketbase';

	const { children } = $props();

	set_app(apps.annuel);
	init_pocketbase(apps.annuel.pocketbase.url, '');
</script>

<div class="max-w-xl- mx-auto- mx-12 my-24 space-y-12">
	{@render children()}
</div>
