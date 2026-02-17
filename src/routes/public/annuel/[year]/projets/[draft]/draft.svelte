<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import type { ProjectDraftsRecord, ProjectsRecord } from '$config/apps/annuel/types';
	import Section from '$lib/components/section.svelte';
	import { use_toaster } from '$lib/logic/toaster.svelte.js';
	import { init_pocketbase, use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import File from '$lib/ui/editor/fields/file.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import Info from './info.svelte';

	const { project, draft }: { project: ProjectsRecord; draft: ProjectDraftsRecord | null } =
		$props();
	// const { project, draft } = $derived(data);

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	// Store initial values
	const initial_name = draft?.name || project?.name;
	const initial_description = draft?.description || project?.description;
	const initial_students = draft?.students || project?.students;
	const initial_tags = JSON.stringify(draft?.tags || []);

	let name = $state(initial_name);
	let description = $state(initial_description);
	let students = $state(initial_students);
	let tags = $state(draft?.tags || []);

	const has_changed = $derived(
		name !== initial_name ||
			description !== initial_description ||
			JSON.stringify(students) !== JSON.stringify(initial_students) ||
			JSON.stringify(tags) !== initial_tags
	);

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form_data = new FormData(event.currentTarget, event.submitter);

		const tags_json = JSON.stringify(tags);
		form_data.set('tags', tags_json);

		console.log(form_data);
		try {
			if (draft?.id) await pocketbase.collection('student_drafts').update(draft.id, form_data);
			else {
				form_data.set('id', project.id);
				console.log(form_data);

				await pocketbase.collection('student_drafts').create(form_data);
			}

			toaster.push('success', 'Merci!');
			invalidate('data:student_draft');
		} catch (err) {
			toaster.push('error');
		}
	}

	function on_change_students(new_ids: string[]) {
		students = new_ids;
		console.log(new_ids);
	}

</script>

<div class="sticky top-0 mb-12 flex items-center justify-between gap-x-gap border-b pb-gap-y">
	<div class="">
		{project.name}
	</div>
	<div>
		<Button disabled={!has_changed} variant="action" type="submit" form="form-submit-student-draft"
			>Publier</Button
		>
	</div>
</div>

status
<br />
<form {onsubmit} id="form-submit-student-draft" class="space-y-gap-y">
	<Input name="name" label="titre" required bind:value={name} />
	<Textarea name="description" label="description" rows={6} required bind:value={description} />
</form>

<div>
	<Relation
		id="d"
		name="students"
		required
		collectionId="students"
		type="relation"
		value={project.students}
		record={project}
		hidden={false}
		primaryKey={false}
		cascadeDelete={false}
		minSelect={1}
		maxSelect={999}
		on_change={on_change_students}
	></Relation>
</div>

<div>
	<File 
	maxSize={5000}
	thumbs=
	id="files"
		name="students"
		required
		type="file"
		value={project.students}
		hidden={false}
		primaryKey={false}
		minSelect={1}
		maxSelect={16}
		 />
</div>

<br />
files

<br />
Invite other students

<Info />
