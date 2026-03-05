<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import type { LayoutProps } from './$types';

	const { children }: LayoutProps = $props();
</script>

<div class="" id="ui">
	<div class="fixed top-0 left-0 w-xs">
		<Nav
			links={[
				{ name: 'text', slug: 'text' },
				{ name: 'fields', slug: 'fields' },
				{ name: 'colors', slug: 'colors' },
				{ name: 'buttons', slug: 'buttons' },
				{ name: 'components', slug: 'components' }
			]}
			base_path="ui"
		/>
	</div>
</div>

<div class="my-16 mr-8 ml-(--container-xs)">
	{@render children()}
</div>

<style>
	#ui {
		--color-accent: oklch(0% 0 0 / 0.1);
	}
</style>
