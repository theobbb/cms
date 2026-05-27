<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import Section from './section.svelte';

	const { spacing_x = 9, ...props }: ComponentProps<typeof Section> = $props();
</script>

<div class={['fixed top-0 right-0 bottom-0 z-100 border-l bg-background']}>
	<Section {...props} {spacing_x} />

	<!-- <div
		class={[
			'grid h-full',
			header && footer
				? 'grid-rows-[auto_1fr_auto]'
				: header
					? 'grid-rows-[auto_1fr]'
					: footer
						? 'grid-rows-[1fr_auto]'
						: ''
		]}
	>
		{#if header}
			<header class="border-b pb-4 text-lg">
				{@render header()}
			</header>
		{/if}
		<main class="-mx-3x min-h-0 overflow-y-auto px-3x pt-3x">
			{@render children()}
		</main>
		{#if footer}
			<footer class="border-t pt-3x">
				{@render footer()}
			</footer>
		{/if}
	</div> -->
</div>
