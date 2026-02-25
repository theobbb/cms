<script lang="ts">
	import { page } from '$app/state';
	import { use_header } from '$lib/components/header/header-manager.svelte';
	import Nav from '$lib/components/nav.svelte';

	const { data, children } = $props();

	const links = [
		{ name: 'Projets', param: 'projects' },
		{ name: 'Finissant-e-s', param: 'students' },
		{ name: 'Finissant-e-s brouillons', param: 'student_drafts' },
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

	const header = use_header();
	header.push_start({
		name: 'Année',
		icon: 'icon-[ri--folder-2-line]',
		options: years,
		param: 'year'
	});
</script>

<Nav links={processed_links} />

{@render children()}
