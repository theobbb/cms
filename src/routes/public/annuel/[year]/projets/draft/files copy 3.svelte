<script module>
	export type MetaFile = {
		caption?: string;
		col_start?: number;
		col_span?: number;
		aspect_ratio?: number;
		mux_upload_id?: string;
		mux_playback_id?: string;
		is_uploading?: boolean;
		upload_progress?: number;
		is_processing?: boolean;
	};
	export type MetaFiles = MetaFile[];

	export const seed_meta_file = { caption: '', col_start: 2, col_span: 3 };
</script>

<script lang="ts">
	import FileInput from '$lib/ui/editor/fields/file.svelte';
	import { type RecordModel } from 'pocketbase';
	import { page } from '$app/state';
	import Info from '../../info.svelte';
	import { tick, untrack } from 'svelte';
	import Button from '$lib/ui/components/button.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';
	import PreviewFile from './preview-file.svelte';
	import { extract_video_frame } from '$lib/utils/video';
	import { file_is_video } from '$lib/utils/files';
	import { MuxUploader } from '$lib/logic/mux';

	let {
		project,
		meta_files = $bindable([])
	}: { project: RecordModel | null | undefined; meta_files: MetaFiles } = $props();

	const { collections } = $derived(page.data);

	let files: (string | File)[] = $state(project?.files || []);
	let prev_files = $state([...files]); // Keep a reference

	const mux_uploader = new MuxUploader();
	const processed_videos = new WeakSet<File>(); // <-- 2. Add this tracker

	async function on_file_change() {
		await tick();

		files.forEach((file, i) => {
			if (file instanceof File && file_is_video(file) && !processed_videos.has(file)) {
				processed_videos.add(file);

				const meta = meta_files[i];

				extract_video_frame(file).then(({ thumbnail, aspect_ratio }) => {
					meta.aspect_ratio = aspect_ratio;

					mux_uploader.upload(file, meta).then(() => {
						const current_index = files.indexOf(file);

						if (current_index !== -1) {
							files[current_index] = thumbnail;
							prev_files[current_index] = thumbnail;
						}
					});
				});
			}
		});
	}

	$effect(() => {
		const current_files = [...files];

		untrack(() => {
			const is_same =
				current_files.length === prev_files.length &&
				current_files.every((f, i) => f === prev_files[i]);

			if (is_same) return;

			// 1. Identify removals to cancel uploads
			const removed = prev_files.filter((f) => !current_files.includes(f));
			removed.forEach((file) => {
				const idx = prev_files.indexOf(file);
				if (meta_files[idx]?.mux_upload_id) {
					mux_uploader.cancel(meta_files[idx].mux_upload_id);
				}
			});

			// 2. Rebuild meta_files tracking the new file positions
			meta_files = current_files.map((file, i) => {
				// Reorder: Find by reference
				const old_idx = prev_files.indexOf(file);
				if (old_idx !== -1) return meta_files[old_idx];

				// Thumbnail swap edge case: The file reference changed, but the array length
				// is identical. Carry over the meta from the previous state.
				if (current_files.length === prev_files.length && meta_files[i]) {
					return meta_files[i];
				}

				// Brand new file
				return { ...seed_meta_file };
			});

			// 3. Sync prev_files for the next run
			prev_files = [...current_files];
		});
	});

	$effect(() => {
		if (project?.files) {
			untrack(() => {
				files = project.files;
				prev_files = [...files];
			});
		}
	});

	const get_meta = (i: number) => {
		if (!meta_files[i]) {
			// Fill any gaps with empty objects to keep payload lean
			for (let j = 0; j <= i; j++) {
				if (!meta_files[j]) meta_files[j] = {};
			}
		}
		return meta_files[i];
	};

	const N_COLS = 5;
</script>

<div class="">
	<Info>
		<div>Limite ~ 5MB / image (peut être + pour vidéo)</div>
	</Info>
	<FileInput
		{...collections.projects.field_map.files}
		bind:files
		value={project?.files}
		label="images et/ou vidéos"
		record={project}
		onchange={on_file_change}
	>
		{#snippet children(file, i)}
			{@const meta = meta_files?.[i] || {}}

			<div class="relative overflow-hidden rounded-md">
				<FileAttachment {file} record_id={project?.id} collection="projects" />

				<!-- Video Badge Indicator -->
				{#if meta.mux_upload_id || meta.mux_playback_id}
					<div
						class="absolute top-1.5 left-1.5 z-20 flex items-center gap-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-md"
					>
						<span class="icon-[ri--video-line]"></span> VIDÉO
						{#if meta.mux_playback_id}
							<!-- Green dot indicating ready -->
							<span
								class="ml-1 size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
								title="Prêt"
							></span>
						{/if}
					</div>
				{/if}

				<!-- Upload & Processing Overlay -->
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
			</div>
		{/snippet}
	</FileInput>
</div>

<div class="mt-12 border-b pb-2 text-xl">Mise en page</div>

<Info>
	<div class="-mt-8">
		L'ordre d'affichage (haut en bas) se fait en glissant-déposant tes fichiers dans la liste
		d'upload juste au-dessus !
	</div>
	<div class="mt-2 mb-8">
		<a class="text-link" href="/help/annuel/fichiers"
			>En savoir plus sur le système de mise en page & colonnes →</a
		>
	</div>
</Info>

<div class="relative">
	<div class="grid gap-4 pb-16" style="grid-template-columns: repeat({N_COLS}, minmax(0, 1fr))">
		{#each files as file, i (file)}
			{@const meta = meta_files?.[i] || {}}
			{@const col_start = Number(meta.col_start ?? seed_meta_file.col_start)}
			{@const col_span = Number(meta.col_span ?? seed_meta_file.col_span)}

			<div
				style="grid-column: {col_start} / span {col_span};"
				class="group relative flex flex-col gap-1"
			>
				<div class=" relative overflow-hidden">
					<PreviewFile {file} record_id={project?.id} />
					{#if meta.is_uploading}
						<div
							class="bg-surface-900/80 absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity"
						>
							<span class="mb-2 font-mono text-sm tracking-wider text-white">
								{Math.round(meta.upload_progress || 0)}%
							</span>
							<div class="bg-surface-700 h-1 w-24 overflow-hidden rounded-full">
								<div
									class="h-full bg-white transition-all duration-100 ease-linear"
									style="width: {meta.upload_progress || 0}%"
								></div>
							</div>
						</div>
					{/if}

					<div
						class="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
					>
						<div class="flex items-start justify-between">
							<div>
								<Button
									onclick={() => (get_meta(i).col_start = col_start - 1)}
									disabled={col_start <= 1}
									tooltip="Déplacer à gauche"
									class="bg-black/50! hover:bg-black!"
									icon="icon-[ri--arrow-left-line]"
									size="lg"
									variant="ghost"
								/>
							</div>

							<div>
								<Button
									onclick={() => (get_meta(i).col_start = col_start + 1)}
									disabled={col_start + col_span > N_COLS}
									tooltip="Déplacer à droite"
									class="bg-black/50! hover:bg-black!"
									icon="icon-[ri--arrow-right-line]"
									size="lg"
									variant="ghost"
								/>
							</div>
						</div>

						<div class="flex items-end justify-center gap-2">
							<div>
								<Button
									onclick={() => (get_meta(i).col_span = col_span - 1)}
									disabled={col_span <= 1}
									tooltip="Réduire la largeur"
									class="bg-black/50! hover:bg-black!"
									icon="icon-[ri--subtract-line]"
									size="lg"
									variant="ghost"
								/>
							</div>
							<div>
								<Button
									onclick={() => (get_meta(i).col_span = col_span + 1)}
									disabled={col_start + col_span > N_COLS}
									tooltip="Augmenter la largeur"
									class="bg-black/50! hover:bg-black!"
									icon="icon-[ri--add-line]"
									size="lg"
									variant="ghost"
								/>
							</div>
						</div>
					</div>
				</div>

				<input
					type="text"
					placeholder="Ajouter une légende..."
					value={meta.caption || ''}
					oninput={(e) => {
						get_meta(i).caption = e.currentTarget.value;
					}}
					class="text-surface-900 focus:border-surface-400 hover:border-surface-300 w-full border-b border-transparent bg-transparent py-1 text-sm transition-colors outline-none"
				/>
			</div>
		{/each}
	</div>

	<div
		class="pointer-events-none absolute inset-0 -z-10 grid gap-4"
		style="grid-template-columns: repeat({N_COLS}, minmax(0, 1fr))"
	>
		{#each { length: N_COLS } as col, i}
			<div class="border-surface-100/50 bg-surface-50/20 h-full border-x"></div>
		{/each}
	</div>
</div>
