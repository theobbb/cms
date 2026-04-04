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
		sm: 'max-w-3xs',
		md: 'max-w-xs',
		lg: 'max-w-xl',
		full: 'flex-3'
	};
</script>

<section
	class={['fixed top-0 right-0 bottom-0 z-100 w-full border-l bg-background p-6 py-4', sizes[size]]}
	style=""
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
			<header class=" border-b pb-3">
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
	</div>
</section>
