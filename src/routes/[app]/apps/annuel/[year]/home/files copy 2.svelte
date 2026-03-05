<script lang="ts">
	import Media from '$lib/components/media.svelte';

	import Button from '$lib/ui/components/button.svelte';
	import { FILE_TYPES, use_editor } from './splash-editor.svelte';

	const editor = use_editor();
</script>

<!-- Media panel -->
<div class="h-full flex-1 overflow-y-auto border-t p-3">
	<div class="mb-2 flex items-center justify-between">
		<span class="">Media</span>
		<label
			class="cursor-pointer rounded border border-[#3c3c3c] bg-[#37373d] px-3 py-1 text-xs text-[#ccc] transition-colors hover:bg-[#444] {editor.uploading
				? 'pointer-events-none opacity-50'
				: ''}"
		>
			{editor.uploading ? 'Uploading…' : '+ Upload'}
			<input
				type="file"
				multiple
				accept="image/*,video/*,.woff,.woff2,.ttf,.otf"
				onchange={(e) => editor.upload_files(e.target.files)}
				class="hidden"
			/>
		</label>
		<Button>{editor.uploading ? '…' : '+'}Upload</Button>
	</div>

	<p class="mb-3 text-[11px] text-[#555]">
		Reference files with <code class="rounded bg-[#1e1e1e] px-1 text-[10px] text-[#ce9178]"
			>@media/filename.jpg</code
		>
	</p>

	{#each FILE_TYPES as type}
		{@const files = editor.media_files.filter((file) => file.type == type)}
		<p class="mb-2 text-[10px] tracking-widest uppercase">{type}</p>
		<div class="mb-3 flex flex-col divide-y border-y">
			{#each files as file}
				<div class="bg-surface group flex items-center gap-2 border-x px-2 py-1.5">
					{#if type == 'image'}
						<Media src={file.url} alt={file.name} thumbnail />
					{:else if type == 'video'}
						<Media src={file.url} alt={file.name} thumbnail />
					{:else if type == 'font'}
						<span class="w-5 font-serif text-[10px] text-[#666]">Aa</span>
					{/if}

					<span class="flex-1 truncate text-xs">{file.name}</span>
					<div class="flex shrink-0 transition-opacity duration-100 not-group-hover:opacity-0">
						<Button
							onclick={() => editor.copy_token(file.name)}
							icon="icon-[ri--file-copy-line]"
							size="sm"
							variant="ghost"
						/>
						<Button
							onclick={() => editor.delete_media(file.id)}
							icon="icon-[ri--delete-bin-line]"
							size="sm"
							variant="ghost"
						/>
					</div>
					<!-- <button
						onclick={() => editor.copy_token(file.name)}
						class="text-xs text-[#666] opacity-0 transition-opacity group-hover:opacity-100"
						>⎘</button
					>
					<button
						onclick={() => editor.delete_media(file.id)}
						class="text-xs text-[#666] opacity-0 transition-opacity group-hover:opacity-100"
						>✕</button
					> -->
				</div>
			{/each}
		</div>
	{/each}

	{#if !editor.media_files.length && !editor.uploading}
		<p class="py-3 text-center text-xs text-[#555]">No media uploaded yet.</p>
	{/if}
</div>
