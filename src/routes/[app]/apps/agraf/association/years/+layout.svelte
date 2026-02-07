<script lang="ts">
	import Nav from '$lib/components/nav.svelte';

	const { data, children } = $props();

	const links = $derived(data.years.map((year) => ({ name: year.id, param: year.id })));
</script>

<Nav {links} base_path="association/years" />

{@render children()}
