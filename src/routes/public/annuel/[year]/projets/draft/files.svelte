<script module>
	export type MetaFile = { caption?: string; col_start?: number; col_span?: number };
	export type MetaFiles = MetaFile[]; // Strictly an array now

	export const seed_meta_file = { caption: '', col_start: 2, col_span: 3 };
</script>

<script lang="ts">
	import File from '$lib/ui/editor/fields/file.svelte';
	import FileItem from './file.svelte';
	import { type RecordModel } from 'pocketbase';
	import { use_pocketbase } from '$lib/pocketbase.js';
	import { page } from '$app/state';
	import Info from '../../info.svelte';
	import Media from '$lib/components/media.svelte';
	import { untrack } from 'svelte';
	import Button from '$lib/ui/components/button.svelte';

	let {
		project,
		meta_files = $bindable([])
	}: { project: RecordModel | null | undefined; meta_files: MetaFiles } = $props();

	const { collections } = $derived(page.data);

	let files = $state(project?.files || []);
	let prev_files = $state([...files]);

	// Reactively align the meta_files array whenever files are re-ordered/added/deleted
	$effect(() => {
		const current_files = files; // Track array reference updates

		untrack(() => {
			let changed = false;
			if (current_files.length !== prev_files.length) changed = true;
			else {
				for (let i = 0; i < current_files.length; i++) {
					if (current_files[i] !== prev_files[i]) changed = true;
				}
			}

			if (changed) {
				const new_meta = current_files.map((file) => {
					const old_index = prev_files.indexOf(file);
					// If the file existed previously, inherit its metadata from its old position
					if (old_index !== -1 && meta_files[old_index]) {
						return meta_files[old_index];
					}
					// Otherwise, it's a new upload. Assign default meta.
					return { ...seed_meta_file };
				});

				meta_files = new_meta;
				prev_files = [...current_files];
			}
		});
	});

	const pocketbase = use_pocketbase();
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
			<FileItem {file} {project} />
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
		{#each files as file, i}
			{#if meta_files[i] && project}
				{@const col_start = Number(meta_files[i].col_start || seed_meta_file.col_start)}
				{@const col_span = Number(meta_files[i].col_span || seed_meta_file.col_span)}

				<div
					style="grid-column: {col_start} / span {col_span};"
					class="group relative flex flex-col gap-1"
				>
					<div class=" relative overflow-hidden">
						<Media
							src={typeof file === 'string'
								? pocketbase.files.getURL(project, file)
								: URL.createObjectURL(file)}
							alt="preview"
						/>

						<div
							class="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
						>
							<div class="flex items-start justify-between">
								<div>
									<Button
										onclick={() => (meta_files[i].col_start -= 1)}
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
										onclick={() => (meta_files[i].col_start += 1)}
										disabled={meta_files[i].col_start + meta_files[i].col_span > N_COLS}
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
										onclick={() => (meta_files[i].col_span -= 1)}
										disabled={meta_files[i].col_span <= 1}
										tooltip="Réduire la largeur"
										class="bg-black/50! hover:bg-black!"
										icon="icon-[ri--subtract-line]"
										size="lg"
										variant="ghost"
									/>
								</div>
								<div>
									<Button
										onclick={() => (meta_files[i].col_span += 1)}
										disabled={meta_files[i].col_start + meta_files[i].col_span > N_COLS}
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
						bind:value={meta_files[i].caption}
						class="text-surface-900 focus:border-surface-400 hover:border-surface-300 w-full border-b border-transparent bg-transparent py-1 text-sm transition-colors outline-none"
					/>
				</div>
			{/if}
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
