<script>
	import { apps } from '$config/apps';
	import { init_pocketbase } from '$lib/pocketbase';

	const { children } = $props();

	init_pocketbase(apps.annuel.pocketbase.url, '');
</script>

<div class="mx-auto my-24 max-w-xl space-y-gap-y">
	{@render children()}
</div>
