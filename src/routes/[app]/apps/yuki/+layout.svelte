<script lang="ts">
	import Nav from '$lib/components/nav/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Posts', slug: 'posts' },
		{ name: 'Tags', slug: 'tags' },
		{ name: 'Groupes', slug: 'groups' },
		{ name: 'Global', slug: 'global' }
	];
</script>

<Nav {links} />

{@render children()}
