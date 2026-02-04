<script lang="ts">
	import { page } from '$app/state';
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();

	const links = [{ name: 'Membres', param: 'membres' }];
</script>

<Nav {links} base_path="association/years/{page.params.year}" />

{@render children()}
