<script lang="ts">
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Affiches', param: 'posters' },
		{ name: 'Association', param: 'association' },
		{ name: 'Catégories (projet)', param: 'project-tags' }
	];
</script>

<Nav {links} />

{@render children()}
