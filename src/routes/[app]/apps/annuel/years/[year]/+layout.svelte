<script lang="ts">
	import { page } from '$app/state';
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Projets', slug: 'projects' },
		{ name: 'Finissant-e-s', slug: 'students' },
		{ name: 'Accueil + remerciements', slug: 'home' }
	];
</script>

<Nav {links} base_path="years/{page.params.year}" />

{@render children()}
