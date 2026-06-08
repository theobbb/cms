<script lang="ts">
	import { page } from '$app/state';

	import Section from '$lib/components/section.svelte';
	import NavGap from '$lib/ui/components/nav/nav-gap.svelte';
	import NavLabel from '$lib/ui/components/nav/nav-label.svelte';
	import NavLink from '$lib/ui/components/nav/nav-link.svelte';
	import Nav from '$lib/ui/components/nav/nav.svelte';

	const { children } = $props();

	const break_layout = ['members', 'sessions'];

	const current = $derived(page.url.pathname.split('/')[2]);
</script>

<div class="flex divide-x">
	<Nav param="/settings">
		<NavLabel>Général</NavLabel>
		<NavLink param="profile">Profil</NavLink>
		<NavLink param="appearance">Apparence</NavLink>
		<NavGap />
		<NavLabel>Authentification</NavLabel>
		<NavLink param="sessions">Sessions</NavLink>
		<NavLink param="members">Membres</NavLink>
		<NavGap />
		<NavLabel>Système</NavLabel>
		<NavLink param="backups">Backups</NavLink>
		<NavLink param="backups">Logs</NavLink>
		<NavLink param="backups">Support</NavLink>
	</Nav>
	<div class="mx-auto w-6xl">
		{#if break_layout.includes(current)}
			{@render children()}
		{:else}
			<Section spacing_x={6}>
				{#snippet header()}
					<div class="py-4 text-xl capitalize">{current}</div>
				{/snippet}

				<div class="py-12">{@render children()}</div>
			</Section>
		{/if}
	</div>
</div>
