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
	import { init_editor, use_editor } from '$lib/ui/editor/editor-context.svelte.js';
	import Info from '../../info.svelte';

	const { data } = $props();
	let { collections } = $derived(data);

	const editor = use_editor();

	const project = $derived(editor.current?.method == 'update' ? editor.current?.record : null);

	// $inspect(project);

	// --- 1. State Logic ---
	const virgin_student_id = $derived(page.url.searchParams.get('student'));

	const form_action = init_form_action();

	type DraftRecord =
		| (RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean })
		| null;

	const onsubmit = form_action.submit(async ({ form_data }) => {
		const record = project as DraftRecord;

		// 1. Append our custom logic directly to the FormData object
		if (record?.draft && record.id) {
			form_data.set('id', record.id);
		}

		const draft_of_val = record?.draft ? record.draft_of : record?.id;
		if (draft_of_val) {
			form_data.set('draft_of', draft_of_val);
		}

		form_data.set('draft', 'true');
		form_data.set('is_latest', 'true');
		form_data.set('year', page.params.year || '');

		// 2. Send the FormData directly (NO JSON.stringify, NO custom headers)
		const res = await fetch(`/public/${page.params.year}/api/draft?collection=projects`, {
			method: 'POST',
			body: form_data
		});

		if (!res.ok) {
			const error_data = await res.json().catch(() => null);
			const pb_err = new ClientResponseError();
			pb_err.response = error_data || { message: 'Erreur serveur inattendue' };
			throw pb_err;
		}

		const new_record: DraftRecord = await res.json();

		form_action.toaster.push('success', `Brouillon enregistré.`);

		if (new_record) {
			editor.open({ method: 'update', record: new_record });
			goto(`/public/${page.params.year}/projets/draft?editor=update&record=${new_record.id}`);
		}
	});
</script>

<form {onsubmit} class="space-y-6">
	<DraftHeader record={project} has_changed={true}>
		{project?.name}
	</DraftHeader>

	<Input name="name" label="titre" required value={project?.name} />

	<Textarea name="description" label="description" rows={6} required value={project?.description} />

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
			value={project?.students || (virgin_student_id ? [virgin_student_id] : [])}
			record={project}
			query={{ sort: 'created', filter: `year = "${page.params.year}" && draft = false` }}
			label="finissant.e.s"
		/>
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
		/>
	</div>

	<Info>
		<div>Limite ~ 5MB / fichier</div>
	</Info>
	<File
		{...collections.projects.field_map.files}
		value={project?.files}
		label="images et/ou vidéos"
	/>

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
</form>
