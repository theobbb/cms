<script lang="ts">
	import File from '$lib/ui/editor/fields/file.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Textarea from '$lib/ui/components/form/fields/textarea.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import DraftHeader from '../../draft-header.svelte';
	import type { RecordModel } from 'pocketbase';
	import Warning from '$lib/ui/templates/box/warning.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';

	const { data } = $props();
	let { collections, project } = $derived(data);

	$inspect(project);

	// --- 1. State Logic ---
	const virgin = $derived(!page.url.searchParams.has('id')); // Are we creating a brand new project?
	const virgin_student_id = $derived(page.url.searchParams.get('student'));

	let virgin_student: RecordModel | null = $state(null);
	// Fetch student info if creating new project from student profile
	// $effect(() => {
	// 	if (virgin && virgin_student_id) {
	// 		fetch(apps.annuel.pocketbase.url + '/api/collections/students/records/' + virgin_student_id)
	// 			.then((r) => r.json())
	// 			.then((student) => {
	// 				project = { expand: { students: [student] } };
	// 			})
	// 			.catch(() => {});
	// 	}
	// });

	function on_change_students(new_ids: string[]) {
		//students = new_ids;
	}

	const form_action = init_form_action();

	const onsubmit = form_action.submit(async ({ form_data }) => {
		const root_id = project?.draft_of || project?.id;
		if (root_id) {
			form_data.set('draft_of', project.id);
		}
		form_data.set('year', page.params.year || '');
		form_data.set('draft', 'true');
		form_data.set('is_latest', 'true');

		console.log(form_data);
		const next_version = project ? Number(project.draft_version) + 1 || 0 : 0;
		form_data.set('draft_version', String(next_version));
		const created = await form_action.pocketbase.collection('projects').create(form_data);

		form_action.toaster.push('success', `Brouillon v${next_version} envoyé.`);

		goto(`/public/${page.params.year}/projets/draft?id=${created.id}`);

		if (root_id)
			fetch(
				`/public/${page.params.year}/api/update-is-latest?collection=${created.collectionId}&id=${root_id}`
			);
	});
</script>

<form {onsubmit} class="space-y-6">
	<DraftHeader record={project} has_changed={true}>
		{project?.name}
	</DraftHeader>

	<Warning>
		Assures-toi de créer ton profil (et qu'il ait été validé) AVANT de créer tes projets.
	</Warning>

	<Input name="name" label="titre" required value={project?.name} />

	<Textarea name="description" label="description" rows={6} required value={project?.description} />

	<div>
		<Relation
			{...collections.projects.field_map.students}
			value={project?.students || (virgin_student_id ? [virgin_student_id] : [])}
			record={project}
			on_change={on_change_students}
			query={{ sort: 'created', filter: `year = "${page.params.year}" && draft = false` }}
		/>
	</div>

	<div class="mt-8">
		<div class="bg-blue text-blue-foreground mb-2 border px-3 py-2 text-sm">
			Directives upload files
		</div>
		<File {...collections.projects.field_map.files} value={project?.files} />
	</div>
</form>
