<script lang="ts">
	import NavFolder from '$lib/ui/components/nav/nav-folder.svelte';
	import NavLink from '$lib/ui/components/nav/nav-link.svelte';
	import Nav from '$lib/ui/components/nav/nav.svelte';
	import Navigation from '$lib/ui/components/navigation.svelte';

	const { children } = $props();
</script>

<Nav>
	<NavLink param="posts">Posts</NavLink>
	<NavLink param="background">Background</NavLink>
	<NavLink param="tags">Tags</NavLink>
</Nav>

{@render children()}
