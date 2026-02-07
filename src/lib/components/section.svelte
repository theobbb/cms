<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		size = 'md',
		children,
		header,
		footer
	}: {
		size?: 'sm' | 'md' | 'lg' | 'full';
		children: Snippet;
		header?: Snippet;
		footer?: Snippet;
	} = $props();

	const sizes = {
		sm: 'flex-1 max-w-3xs',
		md: 'flex-2 max-w-xs',
		lg: 'flex-3 max-w-lg',
		full: 'flex-3'
	};
</script>

<section class={['@container h-section w-full flex-1 px-gap py-gap-y', sizes[size]]}>
	<div
		class={[
			'grid h-full ',

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
			<header class="border-b- mb-gap-y pb-gap-y">
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
	</div>
</section>
