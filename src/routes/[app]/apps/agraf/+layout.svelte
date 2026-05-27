<script lang="ts">
	import NavFolder from '$lib/ui/components/nav/nav-folder.svelte';
	import NavGap from '$lib/ui/components/nav/nav-gap.svelte';
	import NavLabel from '$lib/ui/components/nav/nav-label.svelte';
	import NavLink from '$lib/ui/components/nav/nav-link.svelte';
	import Nav from '$lib/ui/components/nav/nav.svelte';

	const { data, children } = $props();
</script>

<Nav>
	<!-- <NavLink param="inspiratheque">Inspirathèque</NavLink> -->
	<NavLink param="posters">Affichorama</NavLink>

	<NavLink param="roles">Postes</NavLink>
	<NavLink param="chat">Chat</NavLink>
	<NavLink param="comments">Commentaires</NavLink>
	<NavGap />
	<NavLabel>2026</NavLabel>
	<NavFolder param="association" label="Association">
		{#each data.years as year}
			<NavLink param={year.id}>{year.id}</NavLink>
		{/each}
	</NavFolder>
</Nav>

{@render children()}
