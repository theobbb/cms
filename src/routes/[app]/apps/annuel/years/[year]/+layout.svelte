<script lang="ts">
	import { page } from '$app/state';
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Projets', param: 'projects' },
		{ name: 'Finissant-e-s', param: 'students' },
		{ name: 'Accueil + remerciements', param: 'home' }
	];
</script>

<Nav {links} base_path="years/{page.params.year}" />

{@render children()}
