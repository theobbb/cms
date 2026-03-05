<script lang="ts">
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Années', slug: 'years' },
		{ name: 'Postes', slug: 'roles' }
	];
</script>

<Nav {links} base_path="association" />

{@render children()}
