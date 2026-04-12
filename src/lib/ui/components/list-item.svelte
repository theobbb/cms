<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './button.svelte';

	const { on_remove, children }: { on_remove?: () => void; children: Snippet } = $props();
</script>

<div
	data-list-item
	class="-list-item flex min-h-10 items-center justify-between gap-2 border border-b-0 bg-surface px-2.5 py-1.5 pr-2"
>
	{@render children()}
	{#if on_remove}
		<Button
			class="text-muted"
			onclick={on_remove}
			variant="ghost"
			icon="icon-[ri--close-fill]"
			aria-label="Remove item"
			tooltip="Supprimer"
		/>
	{/if}
</div>
