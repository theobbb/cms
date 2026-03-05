<script lang="ts">
	import { page } from '$app/state';

	import Nav from '$lib/components/nav.svelte';

	const { data, children } = $props();

	const links = [
		{ name: 'Projets', slug: 'projects' },
		{ name: 'Finissant-e-s', slug: 'students' },
		{ name: 'Finissant-e-s brouillons', slug: 'student_drafts' },
		{ name: 'Accueil + Remerciements', slug: 'home' },
		{ name: 'Programmes', slug: 'programs' },
		{ name: 'Liens', slug: 'socials' }
	];

	const year = $derived(page.params.year || data.year);

	const processed_links = $derived(
		[...links].map(({ name, slug }) => ({ name, slug: year + '/' + slug }))
	);
</script>

<Nav links={processed_links} />

{@render children()}
