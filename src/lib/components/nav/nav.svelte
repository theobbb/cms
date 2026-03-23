<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavLink from './nav-link.svelte';
	import Section from '../section.svelte';

	type Link = {
		name: string;
		slug: string;
		icon?: string;
	};

	const {
		links: slug_links = [],
		base_path,
		children
	}: { links?: Link[]; base_path?: string; children?: Snippet } = $props();

	const links = $derived(
		[...slug_links].map((link) => ({
			...link,
			href: ['', base_path, link.slug].filter(Boolean).join('/')
		}))
	);
</script>

<Section size="sm">
	<nav class="-mx-2x">
		{#each links as link}
			<NavLink {...link} {base_path} />
		{/each}
		{@render children?.()}
	</nav>
</Section>
