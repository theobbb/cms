<script lang="ts">
	import type { Snippet } from 'svelte';

	let { onclose, children }: { onclose: () => void; children: Snippet } = $props();

	function open(el: HTMLDialogElement) {
		el.showModal();
	}
</script>

<dialog
	class="ml-auto h-screen max-h-none overflow-hidden bg-transparent"
	use:open
	closedby="any"
	{onclose}
>
	{@render children()}
</dialog>
