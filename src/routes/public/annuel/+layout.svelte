<script lang="ts">
	import { apps } from '$config/apps';
	import { set_app } from '$lib/logic/ctx.svelte';
	import { init_pocketbase } from '$lib/pocketbase';
	import Header from './header.svelte';

	const { children } = $props();

	set_app(apps.annuel);
	init_pocketbase(apps.annuel.pocketbase.url, '');
</script>

<div class="absolute top-1.5 left-3.5">
	<a
		href="https://player.mux.com/OKPOFjumoxyrC87Q9cixuRK55woKEY301qZfPCqCJk2w?metadata-video-title=2026-04-28_19-17-27&video-title=2026-04-28_19-17-27"
		target="_blank"
		class="text-link">vidéo explicative →</a
	>
</div>
<div class="mx-auto my-12 mb-36 max-w-2xl space-y-12 px-4">
	<Header />
	{@render children()}
</div>
