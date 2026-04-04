<script lang="ts">
	const { breadcrumbs, collection } = $props();
</script>

{#if breadcrumbs.length > 1}
	<nav class="mb-4">
		{#each breadcrumbs as crumb, i}
			{#if i > 0}
				<span class="mx-2 text-white/20">/</span>
			{/if}

			{#if i < breadcrumbs.length - 1}
				<a href="/{collection}/{crumb.id}" class="text-white/70 hover:underline">
					{crumb.title}
				</a>
			{:else}
				<span class="font-medium text-white">{crumb.title}</span>
			{/if}
		{/each}
	</nav>
{:else}
	<div class="capitalize text-white/70">{collection}</div>
{/if}
