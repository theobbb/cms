<script lang="ts">
	import { use_editor } from './splash-editor.svelte';

	const editor = use_editor();
</script>

{#if editor.preview_open}
	<div class="flex flex-1 flex-col">
		<div class="flex h-9 shrink-0 items-center gap-3 border-b px-4">
			<span class="">Aperçu</span>
			<span class="text-muted rounded-full px-1 text-xs">en direct</span>
		</div>
		<iframe
			title="Landing page preview"
			srcdoc={editor.output}
			sandbox="allow-same-origin"
			class="flex-1 border-none"
		></iframe>
	</div>
{/if}
