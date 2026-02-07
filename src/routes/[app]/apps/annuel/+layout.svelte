<script lang="ts">
	import { page } from '$app/state';
	import NavLink from '$lib/components/nav-link.svelte';
	import Nav from '$lib/components/nav.svelte';
	import Menu from '$lib/ui/pop/menu.svelte';

	const { data, children } = $props();

	const links = [
		{ name: 'Projets', param: 'projects' },
		{ name: 'Finissant-e-s', param: 'students' },
		{ name: 'Accueil + Remerciements', param: 'home' },
		{ name: 'Programmes', param: 'programs' },
		{ name: 'Catégories (projet)', param: 'project-tags' },
		{ name: 'Liens', param: 'socials' }
	];
	const years = data.years.map((year) => year.id);

	const year = $derived(page.params.year || data.year);

	const processed_links = $derived(
		[...links].map(({ name, param }) => ({ name, param: year + '/' + param }))
	);
	$inspect(data);
</script>

<Nav links={processed_links} />

{@render children()}
