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

<section
	class={['w-full flex-1 p-3x pt-2x', sizes[size]]}
	style="height: calc(100svh - var(--spacing)*9);"
>
	<div
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
			<header class="mb-4x">
				{@render header()}
			</header>
		{/if}
		<main class="-mx-3x min-h-0 overflow-y-auto px-3x">
			{@render children()}
		</main>
		{#if footer}
			<footer class="border-t pt-3x">
				{@render footer()}
			</footer>
		{/if}
	</div>
</section>
