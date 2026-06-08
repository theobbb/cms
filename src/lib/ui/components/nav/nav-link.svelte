<!-- NavLink.svelte -->
<script lang="ts">
	import { use_nav } from './nav-ctx.svelte';
	import { page } from '$app/state'; // SvelteKit 2.12+ page rune state
	import type { Snippet } from 'svelte';

	let { param, children }: { param: string; children: Snippet } = $props();

	// Grab access to the closest active navigation parent context
	const nav = use_nav();

	// Compute the absolute href contextually
	// If parent is "/2026" and param is "students", href becomes "/2026/students"
	const href = $derived(`${nav.fullPath}/${param}`.replace(/\/+/g, '/'));
	const isActive = $derived(page.url.pathname === href);
</script>

<li>
	<a
		{href}
		class={[
			'mb-0.5 flex items-center gap-2 px-2.5 py-0.5 duration-50',
			isActive ? 'bg-active' : 'hover:bg-hover'
		]}
	>
		{@render children()}
	</a>
</li>
