<script lang="ts">
	import { page } from '$app/state';

	const year = $derived(page.params.year);

	const param = $derived(page.url.pathname.split('/')[3]);
</script>

<header class="mb-12 flex items-center justify-between gap-8 border-b">
	<div>Annuel {year}</div>
	<div class="flex w-fit items-center gap-1 bg-surface p-1">
		<a
			class={['px-2.5 py-0.5', param == 'finissant-es' ? 'bg-background' : 'text-foreground-muted']}
			href="/public/{year}/finissant-es">Finissant-e-s</a
		>
		<a
			class={['px-2.5 py-0.5', param == 'projets' ? 'bg-background' : 'text-foreground-muted']}
			href="/public/{year}/projets">Projets</a
		>
	</div>
</header>
