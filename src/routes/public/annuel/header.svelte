<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/components/button.svelte';

	const year = $derived(page.params.year);

	const param = $derived(page.url.pathname.split('/')[3]);
</script>

<header class="mb-12 flex items-center justify-between gap-8 border-b">
	<div>Annuel {year}</div>
	<div class="bg-surface gap-gap- flex w-fit items-center gap-1 p-1">
		<Button variant="ghost">Inscription →</Button>
		<a
			class={['px-2.5 py-0.5', param == 'finissant-e-s' ? 'bg-black/10' : 'text-foreground-muted']}
			href="/public/{year}/finissant-e-s">Finissant-e-s</a
		>
		<a
			class={['px-2.5 py-0.5', param == 'projets' ? 'bg-black/10' : 'text-foreground-muted']}
			href="/public/{year}/projets">Projets</a
		>
	</div>
</header>
