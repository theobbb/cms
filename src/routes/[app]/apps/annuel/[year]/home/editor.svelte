<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import { use_editor } from './splash-editor.svelte';

	const editor = use_editor();
</script>

<div class="flex flex-col overflow-hidden border-r {editor.preview_open ? 'w-1/2' : 'w-full'}">
	<!-- Tabs -->
	<div class=" flex shrink-0 border-b">
		{#each ['html', 'css'] as tab}
			<button
				onclick={() => (editor.active_tab = tab as 'html' | 'css')}
				class="border-t-2 border-r px-5 py-2 font-mono text-xs transition-colors
              {editor.active_tab === tab ? '  ' : 'border-t-transparent  '}"
			>
				index.{tab}
			</button>
		{/each}
	</div>

	<!-- Textarea -->
	<textarea
		value={editor.active_tab === 'html' ? editor.html : editor.css}
		oninput={(e) =>
			editor.active_tab === 'html'
				? (editor.html = e.target?.value)
				: (editor.css = e.target?.value)}
		onkeydown={(e) => editor.handle_tab(e)}
		spellcheck="false"
		class="min-h-0 flex-1 resize-none p-4 font-mono text-sm leading-relaxed caret-[#aeafad] outline-none"
		placeholder={editor.active_tab === 'html'
			? 'Write your HTML here. Use @media/filename.jpg to reference uploaded files.'
			: 'Write your CSS here. Styles are automatically scoped to .annuel-custom.'}
	></textarea>
</div>
