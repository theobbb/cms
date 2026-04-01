<script lang="ts">
	import { page } from '$app/state';
	import NavDivider from '$lib/components/nav/nav-divider.svelte';
	import NavLabel from '$lib/components/nav/nav-label.svelte';
	import NavLink from '$lib/components/nav/nav-link.svelte';

	import Nav from '$lib/components/nav/nav.svelte';

	const { data, children } = $props();

	const links = [
		{ name: 'Finissant-e-s', slug: 'students' },
		{ name: 'Projets', slug: 'projects' },

		{ name: 'Accueil', slug: 'home' },
		{ name: 'Programmes', slug: 'programs' },
		{ name: 'Liens', slug: 'socials' }
	];

	const year = $derived(page.params.year || data.years[0]?.id);
</script>

<Nav>
	<NavLabel>{year}</NavLabel>

	<NavLink href="/{year}/students" name="Finissant-e-s" />
	<NavLink href="/{year}/projects" name="Projets" />

	<NavDivider />

	<NavLabel>Global</NavLabel>

	<NavLink href="/{year}/programs" name="Programmes" />
	<NavLink href="/{year}/socials" name="Liens réseaux" />
</Nav>

{@render children()}
