<!-- NavFolder.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { init_nav } from './nav-ctx.svelte';
	import type { Snippet } from 'svelte';

	const {
		label,
		param = null,
		icon,
		children
	}: {
		label: string;
		param?: string | null; // Optional: Inject a path segment (e.g., 'drafts')
		icon?: string;
		children: Snippet;
	} = $props();

	const nav = init_nav(() => param ?? null);

	const has_active_child = $derived(
		nav.fullPath !== '/' && page.url.pathname.startsWith(nav.fullPath)
	);

	let is_open = $state(has_active_child);
</script>

<button
	type="button"
	onclick={() => (is_open = !is_open)}
	class="group mb-0.5 flex w-full items-center justify-between py-0.5 pl-2.5 text-left hover:bg-hover"
>
	<div class="flex items-center gap-2 truncate">
		{#if icon}
			<span class="opacity-60 group-hover:opacity-100">{icon}</span>
		{/if}
		<span class="truncate">{label}</span>
	</div>

	<div class={['icon-[ri--arrow-right-s-line]  transform', is_open && 'rotate-90']}></div>
</button>
{#if is_open}
	<div class="mt-0.5 ml-4 space-y-0.5 pl-3">
		{@render children()}
	</div>
{/if}
