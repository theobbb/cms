<script lang="ts">
	import { page } from '$app/state';

	// import Nav from '$lib/components/nav/nav.svelte';
	import Section from '$lib/components/section.svelte';
	import NavLink from '$lib/ui/components/nav/nav-link.svelte';
	import Nav from '$lib/ui/components/nav/nav.svelte';

	import { icons } from '$lib/ui/icons';

	const { children } = $props();

	const links = [
		{ name: 'Profil', slug: 'profile', icon: icons.user },
		{ name: 'Apparence', slug: 'appearance', icon: 'icon-[ri--drop-line]' },
		{ name: 'Passkeys', slug: 'passkeys', icon: icons.key },
		{ name: 'Backups', slug: 'backups', icon: 'icon-[ri--archive-line]' }
	];

	const link_map = Object.fromEntries(links.map((link) => [link.slug, link.name]));
	const current_name = $derived(link_map[page.url.pathname.split('/')[2]]);
</script>

<div class="flex divide-x">
	<Nav param="/settings">
		<NavLink param="profile">Profil</NavLink>
		<NavLink param="appearance">Apparence</NavLink>
		<NavLink param="passkeys">Passkeys</NavLink>
		<NavLink param="backups">Backups</NavLink>
		<NavLink param="members">Membres</NavLink>
		<NavLink param="backups">Support</NavLink>
	</Nav>
	<Section spacing_x={18}>
		{#snippet header()}
			<div class="py-4 text-xl">{current_name}</div>
		{/snippet}

		<div class="m-5x">{@render children()}</div>
	</Section>
</div>
