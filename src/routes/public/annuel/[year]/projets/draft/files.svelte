<script module>
	export type MetaFile = {
		caption: string;
		col_start: number;
		col_span: number;
		mux_upload_id?: string;
		mux_playback_id?: string;
		is_uploading?: boolean;
		upload_progress?: number;
		is_processing?: boolean; // <-- Add this
	};
	export type MetaFiles = MetaFile[];

	export const seed_meta_file = { caption: '', col_start: 2, col_span: 3 };
</script>

<script lang="ts">
	import * as Upchunk from '@mux/upchunk';
	import FileInput from '$lib/ui/editor/fields/file.svelte';
	import { type RecordModel } from 'pocketbase';
	import { page } from '$app/state';
	import Info from '../../info.svelte';
	import { untrack } from 'svelte';
	import Button from '$lib/ui/components/button.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';
	import PreviewFile from './preview-file.svelte';
	import { extract_video_frame } from '$lib/utils/video';

	let {
		project,
		meta_files = $bindable([])
	}: { project: RecordModel | null | undefined; meta_files: MetaFiles } = $props();

	const { collections } = $derived(page.data);

	let files: (string | File)[] = $state(project?.files || []);
	let prev_files = $state([...files]); // Keep a reference

	const active_uploads = new Map<string, any>();

	async function handle_mux_upload(video_file: File, index: number) {
		get_meta(index).is_uploading = true;
		get_meta(index).upload_progress = 0;

		const res = await fetch(`/public/${page.params.year}/api/mux`, { method: 'POST' });
		const data = await res.json();

		if (!data.url) {
			console.error('The server response is missing the "url" property.');
			get_meta(index).is_uploading = false;
			return;
		}

		get_meta(index).mux_upload_id = data.upload_id;

		const upload = Upchunk.createUpload({
			endpoint: data.url,
			file: video_file,
			chunkSize: 5120
		});

		// --- NEW: Store the upload instance ---
		active_uploads.set(data.upload_id, upload);

		upload.on('progress', (e) => {
			get_meta(index).upload_progress = e.detail;
		});

		upload.on('success', () => {
			get_meta(index).is_uploading = false;
			get_meta(index).upload_progress = 100;
			get_meta(index).is_processing = true; // <-- Start processing state

			active_uploads.delete(data.upload_id);
			poll_for_playback_id(data.upload_id, index);
		});
	}

	async function poll_for_playback_id(upload_id: string, index: number) {
		// Ping the server every 3 seconds
		const interval = setInterval(async () => {
			try {
				const res = await fetch(`/public/${page.params.year}/api/mux/${upload_id}`);
				const data = await res.json();

				// Inside poll_for_playback_id
				if (data.status === 'ready' && data.playback_id) {
					get_meta(index).mux_playback_id = data.playback_id;
					get_meta(index).is_processing = false; // <-- End processing state

					clearInterval(interval);
					console.log('🎉 Mux Playback ID acquired:', data.playback_id);
				}
			} catch (error) {
				console.error('Polling error', error);
				// Optionally clear the interval if it fails too many times to prevent infinite loops
			}
		}, 2000);
	}

	$effect(() => {
		const current_files = files;

		untrack(() => {
			let order_changed = false;

			if (current_files.length === prev_files.length) {
				order_changed = current_files.some((f, i) => f !== prev_files[i]);
			} else {
				order_changed = true;
			}

			if (order_changed) {
				// --- NEW: Identify exactly which files were deleted ---
				const removed_files = prev_files.filter((f) => !current_files.includes(f));

				removed_files.forEach((removed_file) => {
					const old_index = prev_files.indexOf(removed_file);
					const old_meta = meta_files[old_index];

					if (old_meta && old_meta.mux_upload_id) {
						// 1. Abort the frontend upload if it's currently running
						if (active_uploads.has(old_meta.mux_upload_id)) {
							active_uploads.get(old_meta.mux_upload_id).abort();
							active_uploads.delete(old_meta.mux_upload_id);
						}

						// 2. Tell the server to delete the asset from Mux
						// fetch(`/public/${page.params.year}/api/mux`, {
						// 	method: 'DELETE',
						// 	headers: { 'Content-Type': 'application/json' },
						// 	body: JSON.stringify({ upload_id: old_meta.mux_upload_id })
						// }).catch((err) => console.error('Failed to notify server of deletion', err));
					}
				});
				// ------------------------------------------------------

				meta_files = current_files
					.map((file) => {
						const old_index = prev_files.indexOf(file);
						return old_index !== -1 ? meta_files[old_index] : null;
					})
					.map((meta) => meta || undefined) as MetaFiles;

				current_files.forEach((file, i) => {
					if (file instanceof File && file.type.startsWith('video/')) {
						extract_video_frame(file).then((placeholder) => {
							files[i] = placeholder;
						});
						handle_mux_upload(file, i);
					}
				});
				prev_files = [...current_files];
			}
		});
	});

	// 3. Sync if the database record updates (e.g., after save)
	$effect(() => {
		if (project?.files) {
			untrack(() => {
				files = project.files;
			});
		}
	});

	const get_meta = (i: number) => {
		if (!meta_files[i]) {
			// Fill any gaps with seeds up to the index we need
			for (let j = 0; j <= i; j++) {
				if (!meta_files[j]) meta_files[j] = { ...seed_meta_file };
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
	>
		{#snippet children(file, i)}
			{@const meta = meta_files?.[i] || seed_meta_file}

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
			{@const meta = meta_files?.[i] || seed_meta_file}
			{@const col_start = Number(meta?.col_start)}
			{@const col_span = Number(meta?.col_span)}

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
									onclick={() => (get_meta(i).col_start -= 1)}
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
									onclick={() => (get_meta(i).col_start += 1)}
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
									onclick={() => (get_meta(i).col_span -= 1)}
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
									onclick={() => (get_meta(i).col_span += 1)}
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
