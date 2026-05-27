<script lang="ts">
	import { page } from '$app/state';
	import NavLabel from '$lib/ui/components/nav/nav-label.svelte';
	import NavFolder from '$lib/ui/components/nav/nav-folder.svelte';

	import NavLink from '$lib/ui/components/nav/nav-link.svelte';
	import Nav from '$lib/ui/components/nav/nav.svelte';
	import type { RecordModel } from 'pocketbase';
	import NavGap from '$lib/ui/components/nav/nav-gap.svelte';

	const { data, children } = $props();

	const year = $derived(page.params.year || data.years[0]?.id);

	const year_options = $derived(
		page.data.years.map((y: RecordModel) => ({ value: y.id, label: y.id }))
	);
</script>

<Nav param={year}>
	<!-- <Select
		options={year_options}
		value={String(page.params.year)}
		onchange={(option) => goto(`/${option.value}`)}
	/> -->
	<NavLabel>{year}</NavLabel>

	<NavLink param="students">Finissant.es</NavLink>
	<NavLink param="projects">Projets</NavLink>

	<!-- <NavDivider /> -->

	<!-- <NavLabel>Brouillons</NavLabel> -->
	<NavFolder label="Brouillons" param="drafts">
		<NavLink param="students">Finissant.es</NavLink>
		<NavLink param="projects">Projets</NavLink>
	</NavFolder>
	<NavGap />

	<!-- <NavLink param="/drafts/students">Finissant.es</NavLink>
	<NavLink param="/drafts/projects">Projets</NavLink> -->

	<!-- <NavDivider /> -->

	<NavLabel>Global</NavLabel>
	<NavLink param="years">Années</NavLink>
	<NavLink param="programs">Programmes</NavLink>
	<NavLink param="socials">Liens réseaux</NavLink>
</Nav>

{@render children()}
