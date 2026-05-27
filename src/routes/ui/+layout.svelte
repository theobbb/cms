<script lang="ts">
	import NavLink from '$lib/ui/components/nav/nav-link.svelte';
	import Nav from '$lib/ui/components/nav/nav.svelte';

	const { children } = $props();
</script>

<div class="fixed top-0 left-0 w-xs">
	<Nav param="ui">
		<NavLink param="text">text</NavLink>
		<NavLink param="fields">fields</NavLink>

		<NavLink param="colors">colors</NavLink>
		<NavLink param="buttons">buttons</NavLink>
		<NavLink param="components">components</NavLink>
	</Nav>
</div>

<div class="my-16 mr-8 ml-(--container-xs)">
	{@render children()}
</div>
