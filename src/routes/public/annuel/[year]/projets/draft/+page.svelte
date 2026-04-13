<script lang="ts">
	import File from '$lib/ui/editor/fields/file.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Textarea from '$lib/ui/components/form/fields/textarea.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import DraftHeader from '../../draft-header.svelte';
	import { ClientResponseError, type RecordModel } from 'pocketbase';
	import Warning from '$lib/ui/templates/flags/warning.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte.js';
	import { use_pocketbase } from '$lib/pocketbase.js';
	import Info from '../../info.svelte';
	import Files, { seed_meta_file, type MetaFiles } from './files.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import { untrack } from 'svelte';

	const { data } = $props();
	let { collections } = $derived(data);

	const editor = use_editor();
	const toaster = use_toaster();

	const pocketbase = use_pocketbase();
	const project = $derived(editor.current?.method == 'update' ? editor.current?.record : null);

	let meta_files: MetaFiles = $state([]);
	// $inspect(meta_files);

	const form_action = init_form_action();

	let background_color = $state('');
	$effect(() => {
		if (project) {
			meta_files = project.meta_files;
			background_color = project.background;
		}
	});

	type DraftRecord =
		| (RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean })
		| null;

	const onsubmit = form_action.submit(async ({ form_data }) => {
		const toast_id = toaster.push('loading');
		const record = project as DraftRecord;
		const expand_query = editor.expand_string;

		const all_files = form_data.getAll('files');
		const all_thumbnails = form_data.getAll('thumbnail');

		// --- NEW: Tell the server exactly which existing files we are keeping ---
		const retained_files = all_files.filter((f) => typeof f === 'string');
		form_data.set('retained_files', JSON.stringify(retained_files));

		const retained_thumbnails = all_thumbnails.filter((f) => typeof f === 'string');
		form_data.set('retained_thumbnails', JSON.stringify(retained_thumbnails));
		// ------------------------------------------------------------------------

		form_data.delete('files');
		form_data.delete('thumbnail');

		if (record?.draft && record.id) form_data.set('id', record.id);
		const draft_of_val = record?.draft ? record.draft_of : record?.id;
		if (draft_of_val) form_data.set('draft_of', draft_of_val);

		form_data.set('draft', 'true');
		form_data.set('is_latest', 'true');
		form_data.set('year', page.params.year || '');

		const clean_meta_files = $state.snapshot(meta_files);
		form_data.set('meta_files', JSON.stringify(clean_meta_files));

		// 3. SEND TEXT ONLY to SvelteKit API
		const res = await fetch(
			`/public/${page.params.year}/api/draft?collection=projects&expand=${expand_query}`,
			{
				method: 'POST',
				body: form_data
			}
		);

		if (!res.ok) {
			const error_data = await res.json().catch(() => null);
			const pb_err = new ClientResponseError();
			pb_err.response = error_data || { message: 'Erreur serveur inattendue' };
			throw pb_err;
		}

		let final_record: DraftRecord = await res.json();

		if (final_record) {
			try {
				const file_payload = new FormData();

				// --- NEW: Bulletproof String Matching ---
				const serverFiles = final_record?.files || [];
				const serverThumbnails = Array.isArray(final_record?.thumbnail)
					? final_record.thumbnail
					: [final_record?.thumbnail].filter(Boolean);

				const getMappedFile = (oldName: string, arrayToSearch: string[]) => {
					if (!arrayToSearch || arrayToSearch.length === 0) return oldName;

					const dotIndex = oldName.lastIndexOf('.');
					const baseOldName = dotIndex !== -1 ? oldName.substring(0, dotIndex) : oldName;
					const ext = dotIndex !== -1 ? oldName.substring(dotIndex) : '';

					// PocketBase appends a new hash: "image_abc.jpg" -> "image_abc_xyz123.jpg"
					// We find the file that starts with the old base and ends with the exact extension.
					// This is completely immune to array order changes or stale draft states.
					return (
						arrayToSearch.find((sf) => sf.startsWith(baseOldName) && sf.endsWith(ext)) || oldName
					);
				};
				// -------------------------------------------------------------------------

				if (all_files.length === 0) {
					file_payload.append('files', '');
				} else {
					all_files.forEach((f) => {
						if (f instanceof File && f.size === 0) return;
						if (typeof f === 'string') {
							file_payload.append('files', getMappedFile(f, serverFiles));
						} else {
							file_payload.append('files', f);
						}
					});
				}

				if (all_thumbnails.length === 0) {
					file_payload.append('thumbnail', '');
				} else {
					all_thumbnails.forEach((f) => {
						if (f instanceof File && f.size === 0) return;
						if (typeof f === 'string') {
							file_payload.append('thumbnail', getMappedFile(f, serverThumbnails));
						} else {
							file_payload.append('thumbnail', f);
						}
					});
				}

				file_payload.append('meta_files', JSON.stringify(clean_meta_files));

				final_record = await pocketbase
					.collection('projects')
					.update(final_record.id, file_payload, {
						expand: expand_query
					});
			} catch (error) {
				toaster.update(
					toast_id,
					'warning',
					'Le texte a été sauvegardé, mais la mise à jour des fichiers a échoué.'
				);
				console.error('[PocketBase File Sync Error]', error);
				return; // Stops the redirect so you can actually see the error if the payload is too large
			}
		}

		toaster.update(toast_id, 'success', `Brouillon enregistré.`);

		if (final_record) {
			editor.clear_draft();
			editor.open({ method: 'update', record: final_record });
			goto(`/public/${page.params.year}/projets/draft?editor=update&record=${final_record.id}`);
		}
	});
</script>

{#if project || editor.current?.method == 'create'}
	<form {onsubmit} class="space-y-6">
		<DraftHeader record={project} has_changed={true}>
			{project?.name}
		</DraftHeader>

		<Input name="name" label="titre" required value={project?.name} />

		<Textarea
			name="description"
			label="description"
			rows={6}
			required
			value={project?.description}
		/>

		{#if editor.current?.method == 'create'}
			<Warning>
				Seuls les profils de finissant-e <strong>validés</strong> peuvent être ajoutés.
			</Warning>
		{/if}
		<Info>
			<div>
				L’ordre d’apparition des finissant.e.s est généré de manière aléatoire à chaque chargement.
			</div>
		</Info>
		<div>
			<Relation
				{...collections.projects.field_map.students}
				value={project?.students}
				record={project}
				query={{ sort: 'created', filter: `year = "${page.params.year}" && draft = false` }}
				label="finissant.e.s"
			/>
		</div>

		<Info>
			<div>Format : [Prénom] [Nom]</div>
			<div>Example : Louise Paradis</div>
		</Info>
		<Input name="teacher" label="professeur-e" value={project?.teacher} />

		<Info>
			<div>Format : [Nom complet du cours]</div>
			<div>Example : Design d'interaction et expérience utilisateur</div>
		</Info>

		<Input name="class" label="cours" value={project?.class} />

		<Info>
			<div>Format : [2 derniers chiffres de l’année].[Automne : 0, Hiver: 1, Été: 2]</div>
			<div>Example 1 : Automne 2024 → 24.0</div>
			<div>Example 2 : Hiver 2025 → 25.1</div>
			<div>Example 3 : Été 2026 → 26.2</div>
		</Info>
		<Input name="session" label="session" value={project?.session} />

		<Info>
			<div>Tu peux définir une couleur de background pour ta page projet.</div>
			<div>Format : Hex, RGB, HLS, OKLCH, Keyword (blue, green, etc.)</div>
			<div>Example 1 : #D15E47</div>
			<div>Example 2 : oklch(71.647% 0.06301 158.647)</div>
		</Info>
		<div class="relative">
			<Input name="background" label="couleur background" bind:value={background_color} />
			<div
				class="absolute top-2 right-2 size-5 rounded-full"
				style="background-color: {background_color};"
			></div>
		</div>

		<Info>
			<div>Aspect ratio 4:5 obligatoire 😡</div>
			<div>
				Le thumbnail du projet est seulement visible dans la grille de projets — pas sur sa page
				individuelle.
			</div>
			<br />
			<div>
				Si tu laisses ce champ vide → Un thumbnail sera automatiquement généré à partir de la
				<span class="whitespace-nowrap">
					1<sup>ère</sup>
					image
				</span>
				fournie (au champ suivant ↓). Si cette image ne respecte pas le 4:5 (aspect ratio), elle sera
				<span class="italic">crop</span> avec le centre comme point focal.
			</div>
		</Info>
		<div>
			<File
				{...collections.projects.field_map.thumbnail}
				value={project?.thumbnail}
				label="thumbnail"
				required
				record={project}
			/>
		</div>

		<Files {project} bind:meta_files />
	</form>
{/if}
