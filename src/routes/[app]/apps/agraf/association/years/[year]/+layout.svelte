<script lang="ts">
	import { page } from '$app/state';
	import Nav from '$lib/components/nav/nav.svelte';

	const { children } = $props();

	const links = [{ name: 'Membres', slug: 'membres' }];
</script>

<Nav {links} base_path="association/years/{page.params.year}" />

{@render children()}
