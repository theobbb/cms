<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	const {
		size = 'full',
		spacing_x = 3,
		class: cx,
		children,
		header,
		footer
	}: {
		size?: 'sm' | 'md' | 'lg' | 'full';
		spacing_x?: number;
		class?: ClassValue;
		children: Snippet;
		header?: Snippet;
		footer?: Snippet;
	} = $props();

	const sizes = {
		sm: 'w-2xs',
		md: 'w-sm',
		lg: 'w-xl',
		full: 'w-full'
	};
</script>

<section
	class={['h-svh px-(--section-gap)', sizes[size], cx]}
	style="height: 100svh; --section-gap: calc({spacing_x} * var(--spacing));"
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
			<header class="border-b- -mx-(--section-gap) px-(--section-gap)">
				{@render header()}
			</header>
		{/if}
		<main class="-mx-(--section-gap) min-h-0 overflow-y-auto px-(--section-gap)">
			{@render children()}
		</main>
		{#if footer}
			<footer class="-mx-(--section-gap) border-t px-(--section-gap)">
				{@render footer()}
			</footer>
		{/if}
	</div>
</section>
