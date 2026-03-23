<script lang="ts">
	import Nav from '$lib/components/nav/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Affiches', slug: 'posters' },
		{ name: 'Association', slug: 'association' },
		{ name: 'Membres', slug: 'members' },
		{ name: 'Postes', slug: 'roles' },
		{ name: 'Chat', slug: 'chat' },
		{ name: 'Commentaires', slug: 'comments' }
	];
</script>

<Nav {links} />

{@render children()}
