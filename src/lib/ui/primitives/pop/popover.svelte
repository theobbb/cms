<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { Pop } from './pop-context.svelte';

	const { pop, children }: { pop: Pop; children: Snippet } = $props();

	function open(el: HTMLElement) {
		el.showPopover();
	}
	function ontoggle(event: ToggleEvent) {
		if (event.newState === 'closed') pop.close();
	}
</script>

{#if pop.open}
	<div popover="auto" use:open {ontoggle}>
		{@render children()}
	</div>
{/if}
