<script lang="ts">
	import { page } from '$app/state';

	import Nav from '$lib/components/nav.svelte';

	const { data, children } = $props();

	const links = [
		{ name: 'Projets', param: 'projects' },
		{ name: 'Finissant-e-s', param: 'students' },
		{ name: 'Finissant-e-s brouillons', param: 'student_drafts' },
		{ name: 'Accueil + Remerciements', param: 'home' },
		{ name: 'Programmes', param: 'programs' },
		{ name: 'Liens', param: 'socials' }
	];

	const year = $derived(page.params.year || data.year);

	const processed_links = $derived(
		[...links].map(({ name, param }) => ({ name, param: year + '/' + param }))
	);
</script>

<Nav links={processed_links} />

{@render children()}
