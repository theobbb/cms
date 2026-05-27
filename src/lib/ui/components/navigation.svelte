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
	import { page } from '$app/state'; // SvelteKit 2.12+ / Svelte 5 page state
	import Navigation from './navigation.svelte';

	let { items = [], depth = 0 }: { items: NavItem[]; depth?: number } = $props();

	let expandedItems = $state(new Set<string>());

	function toggleFolder(id: string) {
		if (expandedItems.has(id)) {
			expandedItems.delete(id);
		} else {
			expandedItems.add(id);
		}
		// Trigger Svelte reactivity for the built-in Set mutation
		expandedItems = expandedItems;
	}
</script>

<aside>
	<ul class="w-full space-y-0.5 text-sm">
		{#each items as item}
			{#if item.type === 'divider'}
				<li class="my-3 h-px w-full bg-neutral-800" role="presentation"></li>
			{:else if item.type === 'link'}
				{@const isActive = page.url.pathname === item.href}
				<li>
					<a
						href={item.href}
						class="group flex items-center gap-2 rounded px-3 py-1.5 transition-colors duration-150 hover:bg-neutral-900/50 hover:text-neutral-200"
						class:text-neutral-100={isActive}
						class:bg-neutral-900={isActive}
						style="padding-left: {depth * 12 + 12}px"
					>
						<span class="truncate">{item.label}</span>
					</a>
				</li>
			{:else if item.type === 'folder'}
				{@const isExpanded = true}
				<li>
					<button
						type="button"
						class="group flex w-full items-center justify-between rounded px-3 py-1.5 text-left transition-colors duration-150 hover:bg-neutral-900/50 hover:text-neutral-200"
						style="padding-left: {depth * 12 + 12}px"
					>
						<div class="flex items-center gap-2 truncate">
							<span class="truncate">{item.label}</span>
						</div>

						<!-- Minimal CSS-driven arrow rotation -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="h-3 w-3 transform opacity-40 transition-transform duration-150 group-hover:opacity-80"
							class:rotate-90={isExpanded}
						>
							<path
								fill-rule="evenodd"
								d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<!-- Self-recursion for nested links -->
					{#if isExpanded}
						<div role="group" class="w-full">
							<Navigation items={item.children} depth={depth + 1} />
						</div>
					{/if}
				</li>
			{/if}
		{/each}
	</ul>
</aside>
