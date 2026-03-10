<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import { use_editor } from './splash-editor.svelte';

	const editor = use_editor();
</script>

<header class="flex h-12 shrink-0 items-center justify-between border-t">
	<div><Button icon="icon-[ri--information-line]" variant="ghost" tooltip="Guide" /></div>
	<div class="flex items-center gap-2">
		<!-- {#if editor.save_status === 'saving'}
				<span class="text-muted text-xs">Saving…</span>
			{:else if editor.save_status === 'saved'}
				<span class="text-xs text-green-500">✓ Saved</span>
			{:else if editor.save_status === 'error'}
				<span class="text-xs text-red-500">✗ Error</span>
			{/if} -->
		<Button onclick={() => (editor.preview_open = !editor.preview_open)}>
			{editor.preview_open ? 'Hide Preview' : 'Aperçu'}
		</Button>

		<Button
			onclick={() => editor.save()}
			disabled={editor.save_status === 'saving'}
			variant="action"
		>
			Enregistrer
		</Button>
	</div>
</header>
