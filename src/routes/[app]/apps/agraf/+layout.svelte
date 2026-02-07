<script lang="ts">
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Affiches', param: 'posters' },
		{ name: 'Association', param: 'association' },
		{ name: 'Membres', param: 'members' },
		{ name: 'Postes', param: 'roles' },
		{ name: 'Chat', param: 'chat' },
		{ name: 'Commentaires', param: 'comments' }
	];
</script>

<Nav {links} />

{@render children()}
