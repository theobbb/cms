<script lang="ts" generics="T">
	import { type Snippet } from 'svelte';
	import type { Explorer } from './explorer.svelte';
	import Button from '$lib/ui/components/button.svelte';

	const {
		explorer,
		title,
		create_buttons = [],
		allow_edit,
		inspecting,
		metadata,
		children
	}: {
		explorer: Explorer<T>;
		title: string;
		create_buttons?: { text: string; action: () => void }[];
		allow_edit: boolean;
		inspecting: T;
		metadata?: Snippet;
		children?: Snippet;
	} = $props();

	const { actions } = $derived(explorer);
</script>

<div class="w-drawer flex h-full flex-col">
	<header class="flex justify-between gap-3">
		<div class="flex items-center gap-1.5">
			{#each create_buttons as { text, action }}
				<Button class="border-b-0" onclick={action}>+ {text}</Button>
			{/each}
		</div>
		<div class="flex gap-4">
			{#if allow_edit}
				<div>
					<Button class="border-b-0" onclick={() => actions.edit_item(inspecting)}>Éditer</Button>
					<Button
						class="border-b-0"
						variant="danger"
						onclick={() => actions.delete_item(inspecting)}>Supprimer</Button
					>
				</div>
			{/if}
		</div>
	</header>
	<div
		class=" bg-background-2 px-layout-x pt-layout-y h-full overflow-y-auto border-t border-l border-white/20"
	>
		<div class="border-b border-white/20 pb-4">
			<div class="mb-3 text-xl">
				{title}
			</div>
			<div class="relative">
				{@render metadata?.()}
			</div>
		</div>

		<div class="mt-6 space-y-4">{@render children?.()}</div>
	</div>
</div>
