<script module lang="ts">
	interface LinkItem {
		type: 'link';
		label: string;
		href: string;
	}
	interface FolderItem {
		type: 'folder';
		label: string;
		children: NavItem[];
	}
	interface DividerItem {
		type: 'divider';
	}
	export type NavItem = LinkItem | FolderItem | DividerItem;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { init_nav } from './nav-ctx.svelte';

	import NavMenu from './nav-menu.svelte';
	import Section from '$lib/components/section.svelte';

	const { param, children }: { param?: string; children: Snippet } = $props();

	const nav = init_nav(() => param ?? null);
</script>

<Section size="sm">
	<nav class="mt-2 w-full select-none">
		<ul class="">
			<NavMenu />
			{@render children()}
		</ul>
	</nav>
</Section>
