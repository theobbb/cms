<script lang="ts">
	import NavLink from './nav-link.svelte';
	import Section from './section.svelte';

	type Link = {
		name: string;
		slug: string;
		icon?: string;
	};

	const { links: slug_links, base_path }: { links: Link[]; base_path?: string } = $props();

	const links = $derived(
		[...slug_links].map((link) => ({
			...link,
			href: ['', base_path, link.slug].filter(Boolean).join('/')
		}))
	);
</script>

<Section size="sm">
	<nav class="space-y-px">
		{#each links as link}
			<NavLink {...link} {base_path} />
		{/each}
	</nav>
</Section>
