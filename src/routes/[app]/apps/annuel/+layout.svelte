<script lang="ts">
	import { page } from '$app/state';
	import Nav from '$lib/components/nav.svelte';

	const { data, children } = $props();

	const links = [
		{ name: 'Années', param: 'years' },
		{ name: 'Programmes', param: 'programs' },
		{ name: 'Catégories (projet)', param: 'project-tags' },
		{ name: 'Liens', param: 'socials' }
	];
</script>

<Nav {links} />

{@render children()}
