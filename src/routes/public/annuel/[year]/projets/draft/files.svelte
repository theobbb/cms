<script module>
	export type MetaFile = { caption: string; col_start: number; col_span: number };
	export type MetaFiles = MetaFile[];

	export const seed_meta_file = { caption: '', col_start: 2, col_span: 3 };
</script>

<script lang="ts">
	import File from '$lib/ui/editor/fields/file.svelte';
	import { type RecordModel } from 'pocketbase';
	import { use_pocketbase } from '$lib/pocketbase.js';
	import { page } from '$app/state';
	import Info from '../../info.svelte';
	import Media from '$lib/components/media.svelte';
	import { untrack } from 'svelte';
	import Button from '$lib/ui/components/button.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';
	import PreviewFile from './preview-file.svelte';

	let {
		project,
		meta_files = $bindable([])
	}: { project: RecordModel | null | undefined; meta_files: MetaFiles } = $props();

	const { collections } = $derived(page.data);

	let files = $state(project?.files || []);
	let prev_files = $state([...files]); // Keep a reference

	// Watch for re-orders or deletions
	$effect(() => {
		// We reference 'files' so Svelte tracks it
		const current_files = files;

		untrack(() => {
			let order_changed = false;

			// Check if items moved around or if length changed
			if (current_files.length === prev_files.length) {
				order_changed = current_files.some((f, i) => f !== prev_files[i]);
			} else {
				order_changed = true; // Added or removed
			}

			if (order_changed) {
				// Re-align the meta_files array to match the new files order
				meta_files = current_files
					.map((file) => {
						const old_index = prev_files.indexOf(file);
						// If the file existed before, grab its old metadata.
						// If not, it's a new upload, so let get_meta() handle it later (return undefined/null)
						return old_index !== -1 ? meta_files[old_index] : null;
					})
					.map((meta) => meta || undefined) as MetaFiles; // clean up nulls

				prev_files = [...current_files]; // update reference
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
		<div>Limite ~ 5MB / fichier</div>
	</Info>
	<File
		{...collections.projects.field_map.files}
		bind:files
		value={project?.files}
		label="images et/ou vidéos"
		record={project}
	>
		{#snippet children(file, i)}
			<FileAttachment {file} record_id={project?.id} collection="projects" />
			<!-- <FileItem {file} {project} /> -->
		{/snippet}
	</File>
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
			{@const meta = meta_files[i] || seed_meta_file}
			{@const col_start = Number(meta.col_start)}
			{@const col_span = Number(meta.col_span)}

			<div
				style="grid-column: {col_start} / span {col_span};"
				class="group relative flex flex-col gap-1"
			>
				<div class=" relative overflow-hidden">
					<PreviewFile {file} record_id={project?.id} />
					<!-- <Media
						src={typeof file === 'string' && project
							? pocketbase.files.getURL(project, file)
							: URL.createObjectURL(file)}
						alt="preview"
					/> -->

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
