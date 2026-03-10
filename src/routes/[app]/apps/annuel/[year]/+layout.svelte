<script lang="ts">
	import { page } from '$app/state';

	import Nav from '$lib/components/nav.svelte';

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

<Nav {links} base_path="/{year}" />

{@render children()}
