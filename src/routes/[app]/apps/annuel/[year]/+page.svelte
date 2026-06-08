<script lang="ts">
	import { page } from '$app/state';
	import Section from '$lib/components/section.svelte';
	import { set_collection } from '$lib/logic/ctx.svelte';
	import { MuxUploader } from '$lib/logic/mux.js';
	import Color from '$lib/ui/editor/fields/color.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';
	import FileInput from '$lib/ui/editor/fields/file.svelte';
	import Markdown from '$lib/ui/editor/fields/markdown.svelte';
	import FileProcessorMux from '$lib/ui/file-processors/file-processor-mux.svelte';
	import ConfirmCancel from '$lib/ui/templates/confirm-cancel.svelte';

	const { data } = $props();

	set_collection(data.collections.years);

	const year = $derived(data.year);

	const mux_uploader = new MuxUploader();

	let video_files: (string | File)[] = $state([]);
	let mux_meta = $state(year.mux_meta);
</script>

<div class="mx-auto w-full max-w-3xl">
	<Section spacing_x={12}>
		{#snippet header()}
			<div class="mb-6 py-3 text-xl">
				{page.params.year}
			</div>
		{/snippet}
		<div class="space-y-6">
			config texte poster

			<FileInput
				{...data.collections.years.field_map.video}
				value={year.video}
				record={year}
				bind:files={video_files}
				>{#snippet children(file, i)}
					<div class="relative overflow-hidden rounded-md">
						<FileAttachment {file} record_id={year?.id} collection="projects" />
						<FileProcessorMux
							bind:file={video_files[0]}
							bind:meta={mux_meta}
							uploader={mux_uploader}
						/>
					</div>
				{/snippet}
			</FileInput>

			<Markdown label="Texte" {...data.collections.years.field_map.text} value={data.year.text} />

			<!-- <File
				{...data.collections.years.field_map.poster}
				value={data.year.poster}
				record={data.year}
			/> -->
			<Color {...data.collections.years.field_map.accent_color} />
		</div>

		{#snippet footer()}
			<div class="py-3">
				<ConfirmCancel confirm="Enregistrer" />
			</div>
		{/snippet}
	</Section>
</div>
