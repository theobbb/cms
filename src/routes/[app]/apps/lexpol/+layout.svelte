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
	<NavLink param="posts">Posts</NavLink>
	<NavLink param="post-types">Post types</NavLink>

	<NavLink param="members">Membres</NavLink>
</Nav>

{@render children()}
