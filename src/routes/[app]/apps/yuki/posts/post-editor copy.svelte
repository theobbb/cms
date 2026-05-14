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
	import { extract_video_frame } from '$lib/utils/video';
	import { file_is_video } from '$lib/utils/files';
	import type { RecordModel } from 'pocketbase';
	import { process_image } from '$lib/utils/media';

	const { items }: { items: RecordModel[] } = $props();

	const editor = use_editor();
	const collections = $derived(page.data.collections);

	const post: RecordModel | null = $derived(
		editor.current?.method == 'update' ? editor.current.record : null
	);

	const mux_uploader = new MuxUploader();

	let files: (string | File)[] = $state(post?.file ? [post.file] : []);
	let mux_data = $state<any>(post?.mux || {});
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
				mux_data = post.mux || {};
			});
		}
	});

	async function onchange() {
		const file = files[0]; // No need to snapshot, just grab the reference

		// 2. Handle File Deletion
		if (!file) {
			if (mux_data?.mux_upload_id) {
				mux_uploader.cancel(mux_data.mux_upload_id);
			}

			mux_data = {}; // Wipe mux data so it doesn't get saved to DB
			return;
		}

		// 3. Handle Video Upload
		if (!(file instanceof File)) return;

		if (file_is_video(file)) {
			mux_data = { is_uploading: true, upload_progress: 0 };

			extract_video_frame(file).then((processed) => {
				mux_data.aspect_ratio = aspect_ratio;
				aspect_ratio = processed.aspect_ratio;

				mux_uploader.upload(file, mux_data).then(() => {
					// Check if this specific file is still the one in the input
					if (files[0] === file) {
						files[0] = processed.thumbnail;
					}
				});
			});
		} else {
			const processed_image = await process_image(file); // Max 3MB
			aspect_ratio = processed_image.aspect_ratio;

			files[0] = processed_image.file;
		}
	}

	async function onsubmit({ form_data, record, method }: EditorFormActionContext) {
		if (method === 'create') {
			const min_sort = (items[0].sort_order || 0) - 10;

			form_data.set('sort_order', (min_sort - 10).toString());
		}
		form_data.set('aspect_ratio', String(aspect_ratio));
		form_data.set('width', '100');
		form_data.set('mux', JSON.stringify($state.snapshot(mux_data)));
	}
</script>

{#if editor.current != null && page.url.searchParams.has('editor')}
	<Editor {onsubmit}>
		<div class="flex flex-col gap-3x pt-1x pb-12">
			<FileInput
				{...collections.posts.field_map.file}
				bind:files
				value={post?.file}
				label="images et/ou vidéos"
				record={post}
				{onchange}
			>
				{#snippet children(file, i)}
					{@const mux = mux_data}
					<div class="relative overflow-hidden rounded-md">
						<FileAttachment {file} record_id={post?.id} collection="posts" />

						{#if mux.mux_upload_id || mux.mux_playback_id}
							<div
								class="absolute top-1.5 left-1.5 z-20 flex items-center gap-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-md"
							>
								<span class="icon-[ri--video-line]"></span> VIDÉO
								{#if mux.mux_playback_id}
									<span
										class="ml-1 size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
										title="Prêt"
									></span>
								{/if}
							</div>
						{/if}

						{#if mux.is_uploading || mux.is_processing}
							<div
								class="bg-surface-900/80 absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity"
							>
								{#if mux.is_uploading}
									<span class="mb-1.5 font-mono text-xs tracking-wider text-white">
										{Math.round(mux.upload_progress || 0)}%
									</span>
									<div class="bg-surface-700 h-1 w-16 overflow-hidden rounded-full">
										<div
											class="h-full bg-white transition-all duration-100 ease-linear"
											style="width: {mux.upload_progress || 0}%"
										></div>
									</div>
								{:else if mux.is_processing}
									<span class="icon-[ri--loader-4-line] animate-spin text-xl text-white"></span>
								{/if}
							</div>
						{/if}
					</div>
				{/snippet}
			</FileInput>

			<Text {...collections.posts.field_map.caption} rows={3}></Text>

			<div>
				<Relation
					{...collections.posts.field_map.tags}
					label="tags"
					record={post}
					value={post?.tags}
				/>
			</div>
		</div>
	</Editor>
{/if}
