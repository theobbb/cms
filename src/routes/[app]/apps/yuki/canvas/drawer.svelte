<script lang="ts">
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import { MuxUploader } from '$lib/logic/mux';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte';
	import Editor, { type EditorFormActionContext } from '$lib/ui/editor/editor.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';
	import FileInput from '$lib/ui/editor/fields/file.svelte'; // <-- Renamed to avoid native File conflict
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Text from '$lib/ui/editor/fields/text.svelte';
	import { file_is_audio, file_is_image, file_is_video } from '$lib/utils/files';
	import type { CollectionModel, RecordModel } from 'pocketbase';
	import { process_image } from '$lib/utils/media';
	import FileProcessorMux from '$lib/ui/file-processors/file-processor-mux.svelte';
	import FileProcessorWaveform from '$lib/ui/file-processors/file-processor-waveform.svelte';
	import { WaveformExtractor } from '$lib/logic/waveform';

	const { collection, items }: { collection: CollectionModel; items: RecordModel[] } = $props();

	const editor = use_editor();
	const collections = $derived(page.data.collections);

	const post: RecordModel | null = $derived(
		editor.current?.method == 'update' ? editor.current.record : null
	);

	const mux_uploader = new MuxUploader();
	const waveform_extractor = new WaveformExtractor();

	let files: (string | File)[] = $state(post?.file ? [post.file] : []);
	let mux_meta = $state<any>(post?.mux_meta || {});
	let audio_meta = $state<any>(post?.audio_meta || {});

	let aspect_ratio = $state(1);

	const pop = new Pop();
	$effect(() => {
		if (editor.current != null && page.url.searchParams.has('editor')) {
			pop.show();
		}
	});

	// 1. Tiny watcher just to sync data when the DB record updates (e.g., after save)
	$effect(() => {
		if (post) {
			untrack(() => {
				files = post.file ? (Array.isArray(post.file) ? post.file : [post.file]) : [];
				mux_meta = post.mux_meta || {};
				audio_meta = post.audio_meta || {};
			});
		}
	});

	async function onchange(new_files: File[]) {
		const file = new_files[0]; // No need to snapshot, just grab the reference

		// 3. Handle Video Upload
		if (!(file instanceof File)) return;

		if (file_is_audio(file)) aspect_ratio = 6;

		if (file_is_image(file)) {
			console.log('process_image');
			const processed_image = await process_image(file); // Max 3MB
			aspect_ratio = processed_image.aspect_ratio;
			files[0] = processed_image.file;
		}
	}

	async function onsubmit({ form_data, record, method }: EditorFormActionContext) {
		if (method != 'create') return;
		const min_sort = items.length > 0 ? (items[0].sort_order || 0) - 10 : 0;

		form_data.set('sort_order', (min_sort - 10).toString());

		form_data.set('aspect_ratio', String(aspect_ratio));
		form_data.set('width', '50');
		form_data.set('mux_meta', JSON.stringify($state.snapshot(mux_meta)));
		form_data.set('audio_meta', JSON.stringify($state.snapshot(audio_meta)));
	}
</script>

{#if editor.current != null && page.url.searchParams.has('editor')}
	<Editor {onsubmit}>
		<div class="flex flex-col gap-3x pt-1x pb-12">
			{#if editor.current?.method == 'create'}
				<FileInput
					{...collection.field_map.file}
					bind:files
					value={post?.file}
					label="images et/ou vidéos"
					record={post}
					{onchange}
				>
					{#snippet children(file, i)}
						<div class="relative overflow-hidden rounded-md">
							<FileAttachment {file} record_id={post?.id} collection={collection.name} />
							<FileProcessorMux bind:file={files[i]} bind:meta={mux_meta} uploader={mux_uploader} />
							<FileProcessorWaveform
								bind:file={files[i]}
								bind:meta={audio_meta}
								extractor={waveform_extractor}
							/>
						</div>
					{/snippet}
				</FileInput>
			{/if}

			<Text {...collection.field_map.caption} rows={3}></Text>

			<div>
				<Relation {...collection.field_map.tags} label="tags" record={post} value={post?.tags} />
			</div>
		</div>
	</Editor>
{/if}
