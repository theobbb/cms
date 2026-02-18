<script lang="ts">
	import { page } from '$app/state';
	import { apps } from '$config/apps';
	import { set_app } from '$lib/logic/ctx.svelte';
	import { init_pocketbase } from '$lib/pocketbase';

	const { children } = $props();

	set_app(apps.annuel);
	init_pocketbase(apps.annuel.pocketbase.url, '');
</script>

<div class="mx-auto my-24 max-w-xl space-y-12">
	{@render children()}
</div>
