<script lang="ts">
	import Nav from '$lib/components/nav/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Table', slug: '/inspiratheque/posters' },
		{ name: 'List', slug: '/inspiratheque/association' },
		{ name: 'Tags groupes', slug: '/inspiratheque/members' },
		{ name: 'Tags', slug: '/inspiratheque/roles' }
	];
</script>

<Nav {links} />

{@render children()}
