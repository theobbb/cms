<script lang="ts">
	import File from '$lib/ui/editor/fields/file.svelte';
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
		<div class="mb-3 flex flex-col gap-1">
			{#each files as file}
				<div class="group flex items-center gap-2 rounded border px-2 py-1.5">
					{#if type == 'image'}
						<img src={file.url} alt={file.name} class="block h-14 w-full object-cover" />
					{:else if type == 'video'}
						<span class="w-5 text-[10px] text-[#666]">▶</span>
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

	<!-- Images -->
	{#if editor.images.length}
		<p class="mb-2 text-[10px] tracking-widest text-[#555] uppercase">Images</p>
		<div class="mb-3 flex flex-wrap gap-2">
			{#each editor.images as f}
				<div class="group w-20 overflow-hidden rounded border border-[#3c3c3c] bg-[#1e1e1e]">
					<img src={f.url} alt={f.name} class="block h-14 w-full object-cover" />
					<div class="flex items-center justify-between px-1 py-0.5">
						<span class="max-w-[44px] truncate text-[10px] text-[#888]">{f.name}</span>
						<div class="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
							<button
								onclick={() => editor.copy_token(f.name)}
								class="px-0.5 text-xs text-[#666] hover:text-white">⎘</button
							>
							<button
								onclick={() => editor.delete_media(f.id)}
								class="px-0.5 text-xs text-[#666] hover:text-[#f48771]">✕</button
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Videos -->
	{#if editor.videos.length}
		<p class="mb-2 text-[10px] tracking-widest text-[#555] uppercase">Videos</p>
		<div class="mb-3 flex flex-col gap-1">
			{#each editor.videos as f}
				<div
					class="group flex items-center gap-2 rounded border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1.5"
				>
					<span class="w-5 text-[10px] text-[#666]">▶</span>
					<span class="flex-1 truncate text-xs text-[#ccc]">{f.name}</span>
					<button
						onclick={() => editor.copy_token(f.name)}
						class="text-xs text-[#666] opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
						>⎘</button
					>
					<button
						onclick={() => editor.delete_media(f.id)}
						class="text-xs text-[#666] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#f48771]"
						>✕</button
					>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Fonts -->
	{#if editor.fonts.length}
		<p class="mb-2 text-[10px] tracking-widest text-[#555] uppercase">Fonts</p>
		<div class="mb-2 flex flex-col gap-1">
			{#each editor.fonts as f}
				<div
					class="group flex items-center gap-2 rounded border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1.5"
				>
					<span class="w-5 font-serif text-[10px] text-[#666]">Aa</span>
					<span class="flex-1 truncate text-xs text-[#ccc]">{f.name}</span>
					<button
						onclick={() => editor.copy_token(f.name)}
						class="text-xs text-[#666] opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
						>⎘</button
					>
					<button
						onclick={() => editor.delete_media(f.id)}
						class="text-xs text-[#666] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#f48771]"
						>✕</button
					>
				</div>
			{/each}
		</div>
		<p class="text-[10px] text-[#555]">
			Use in CSS: <code class="rounded bg-[#1e1e1e] px-1 text-[10px] text-[#ce9178]"
				>src: url('@media/font.woff2')</code
			>
		</p>
	{/if}

	{#if !editor.media_files.length && !editor.uploading}
		<p class="py-3 text-center text-xs text-[#555]">No media uploaded yet.</p>
	{/if}
</div>
