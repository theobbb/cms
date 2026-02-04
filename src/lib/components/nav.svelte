<script lang="ts">
	import NavLink from './nav-link.svelte';
	import Section from './section.svelte';

	type Link = {
		name: string;
		param: string;
	};

	const { links, base_path }: { links: Link[]; base_path?: string } = $props();
</script>

<Section size="sm">
	<nav class="my-gap-y">
		{#each links as { name, param }}
			<NavLink {param} {name} {base_path} />
		{/each}
	</nav>
</Section>
