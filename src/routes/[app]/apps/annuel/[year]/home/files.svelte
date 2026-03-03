<script lang="ts">
	import Media from '$lib/components/media.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import Button from '$lib/ui/styled/button.svelte';
	import Info from '$lib/ui/templates/box/info.svelte';
	import { FILE_TYPES, use_editor } from './splash-editor.svelte';

	const editor = use_editor();

	// Derive the display URL for any MediaFile (pending or persisted)
	function file_url(file: ReturnType<typeof editor.media_files>[number]) {
		return file.kind === 'persisted' ? file.url : file.blob_url;
	}

	let input_file: HTMLInputElement | null = $state(null);
</script>

<div class="h-full flex-1 overflow-y-auto py-gap-y pl-gap">
	<!-- Header -->
	<!-- <div class="mb-2 flex items-center justify-between">
		<span>Media</span>
		<label
			class="cursor-pointer rounded border border-[#3c3c3c] bg-[#37373d] px-3 py-1 text-xs text-[#ccc] transition-colors hover:bg-[#444]"
		>
			+ Upload
			
		</label>
	</div> -->
	<input
		bind:this={input_file}
		type="file"
		multiple
		accept="image/*,video/*,.woff,.woff2,.ttf,.otf"
		onchange={(e) => {
			if (e.target.files) editor.stage_files(e.target.files);
			e.target.value = '';
		}}
		class="hidden"
	/>
	<div class="mb-2 flex items-center justify-between gap-3">
		<div>Fichiers</div>
		<Button onclick={() => input_file?.click()}>+ Importer</Button>
	</div>

	<!-- <div class="my-4"><Info>Référencer les fichiers avec @media/filename.jpg</Info></div> -->

	<!-- File list grouped by type -->
	{#each FILE_TYPES as type}
		{@const files = editor.media_files.filter((f) => f.type === type)}
		{#if files.length}
			<Label label="{type}s" id={type} />

			<div class="mb-3 flex flex-col divide-y border-y">
				{#each files as file}
					<div class="bg-surface group flex h-10 items-center gap-2 border-x px-2 py-1.5">
						<!-- Thumbnail / icon -->
						<a class="flex min-w-0 flex-1 items-center gap-3" href={file_url(file)} target="_blank">
							{#if type === 'image' || type === 'video'}
								<Media src={file_url(file)} alt={file.name} thumbnail />
							{:else if type === 'font'}
								<span class="w-5 font-serif text-[10px] text-[#666]">Aa</span>
							{/if}
							<span class="flex-1 truncate text-sm">{file.name}</span>
						</a>

						<!-- Filename + pending badge -->

						{#if file.kind === 'pending'}
							<span
								class="shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-400"
							>
								pending
							</span>
						{/if}

						<!-- Actions -->
						<div
							class="flex shrink-0 gap-0.5 transition-opacity duration-100 not-group-hover:opacity-0"
						>
							<Button
								onclick={() => editor.copy_token(file.name)}
								icon="icon-[ri--file-copy-line]"
								size="sm"
								variant="ghost"
							/>
							<Button
								onclick={() => editor.remove_file(file)}
								icon="icon-[ri--close-line]"
								size="sm"
								variant="ghost"
							/>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/each}

	{#if !editor.media_files.length}
		<p class="py-3 text-center text-xs text-[#555]">No media uploaded yet.</p>
	{/if}
</div>
