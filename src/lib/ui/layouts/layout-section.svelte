<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		size = 'md',
		children,
		header,
		footer
	}: {
		size?: 'sm' | 'md' | 'lg';
		children: Snippet;
		header?: Snippet;
		footer?: Snippet;
	} = $props();

	const sizes = {
		sm: 'min-w-3xs',
		md: 'min-w-xs',
		lg: 'min-w-lg'
	};
</script>

<section
	class={[
		'grid h-section min-w-3xs px-gap py-gap-y',
		sizes[size],
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
		<header class="mb-gap-y border-b pb-gap-y">
			{@render header()}
		</header>
	{/if}
	<main class="-mx-gap min-h-0 overflow-y-auto px-gap">
		{@render children()}
	</main>
	{#if footer}
		<footer class=" border-t pt-gap-y">
			{@render footer()}
		</footer>
	{/if}
</section>
