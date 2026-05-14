<script lang="ts">
	import { use_form_action, type FormActionContext } from '$lib/logic/form-action.svelte';
	import type { MuxMetaState, MuxUploader } from '$lib/logic/mux';
	import { file_is_video } from '$lib/utils/files';
	import { extract_video_frame } from '$lib/utils/video';

	let {
		file = $bindable(),
		meta = $bindable(),
		uploader
	}: { file: File | string; meta: MuxMetaState; uploader: MuxUploader } = $props();

	if (!meta) meta = {};

	let last_file: File | string | null = $state(null);

	const form_action = use_form_action();

	function update_file() {
		if (!file) {
			if (meta?.upload_id) {
				uploader.cancel(meta.upload_id);
			}
			meta = {};
			return;
		}

		if (!(file instanceof File)) return;

		if (!file_is_video(file)) return;

		meta = { is_uploading: true, upload_progress: 0 };

		extract_video_frame(file).then(({ thumbnail, aspect_ratio }) => {
			meta.aspect_ratio = aspect_ratio;

			if (!(file instanceof File)) return;
			uploader.upload(file, meta).then(() => {
				last_file = thumbnail;
				file = thumbnail;
			});
		});
	}

	$effect(() => {
		if (file !== last_file) {
			update_file();
			last_file = file;
		}

		return () => {
			if (meta?.upload_id) uploader.cancel(meta.upload_id);
		};
	});

	// TODO delete video if not present in files anymore
	// if (form_action) {
	// 	form_action.register_hook(({ form_data, cancel }) => {

	// 	});
	// }
</script>

{#if meta.upload_id || meta.playback_id}
	<div
		class="absolute top-1.5 left-1.5 z-20 flex items-center gap-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-md"
	>
		<span class="icon-[ri--video-line]"></span> VIDÉO
		{#if meta.playback_id}
			<span
				class="ml-1 size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
				title="Prêt"
			></span>
		{/if}
	</div>
{/if}

{#if meta.is_uploading || meta.is_processing}
	<div
		class="bg-surface-900/80 absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity"
	>
		{#if meta.is_uploading}
			<span class="mb-1.5 font-mono text-xs tracking-wider text-white">
				{Math.round(meta.upload_progress || 0)}%
			</span>
			<div class="bg-surface-700 h-1 w-16 overflow-hidden rounded-full">
				<div
					class="h-full bg-white transition-all duration-100 ease-linear"
					style="width: {meta.upload_progress || 0}%"
				></div>
			</div>
		{:else if meta.is_processing}
			<span class="icon-[ri--loader-4-line] animate-spin text-xl text-white"></span>
		{/if}
	</div>
{/if}
