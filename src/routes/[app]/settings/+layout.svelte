<script lang="ts">
	import { page } from '$app/state';
	import Nav from '$lib/components/nav/nav.svelte';
	import Section from '$lib/components/section.svelte';
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
	<Nav {links} base_path="/settings" />
	<Section size="full">
		<div class="text-lg">{current_name}</div>
		<div class="m-5x">{@render children()}</div>
	</Section>
</div>
