<script lang="ts">
	import { use_pocketbase } from '$lib/pocketbase';
	import { use_toaster } from '$lib/logic/toaster.svelte';
	import Button from '$lib/ui/button.svelte';
	import File from '$lib/ui/editor/fields/file.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';

	import { goto, invalidate } from '$app/navigation';
	import { set_collection } from '$lib/logic/ctx.svelte';
	import type { SubmitCallback } from '$config/field.types';
	import { page } from '$app/state';
	import { apps } from '$config/apps';

	let { collection, project, draft, virgin } = $props();

	const draft_mode = $derived(draft?.id);

	const virgin_from_student = $derived(page.url.searchParams.get('student'));

	async function fetch_student() {
		try {
			const res = await fetch(
				apps.annuel.pocketbase.url + '/api/collections/students/records/' + virgin_from_student
			);

			const student = await res.json();
			console.log(student);
			project = { expand: { students: [student] } };
		} catch (_) {}
	}
	$effect(() => {
		if (virgin && virgin_from_student) fetch_student();
	});

	$inspect(project);

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

	let onsubmit_students: SubmitCallback<any> = $state(() => {});

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form_data = new FormData(event.currentTarget, event.submitter);

		const tags_json = JSON.stringify(tags);
		form_data.set('tags', tags_json);

		await onsubmit_students(form_data, () => {});

		let virgin_id;
		console.log(form_data);
		try {
			if (draft?.id) await pocketbase.collection('project_drafts').update(draft.id, form_data);
			else {
				if (!virgin) form_data.set('id', project.id);
				console.log(form_data);

				const new_draft = await pocketbase.collection('project_drafts').create(form_data);
				virgin_id = new_draft.id;
			}
			console.log(virgin_id);
			toaster.push('success', 'Merci!');
			invalidate('data:project_draft');
			if (virgin) {
				goto(`/public/${page.params.year}/projets/${virgin_id}`);
			}
		} catch (err) {
			toaster.push('error');
		}
	}

	function on_change_students(new_ids: string[]) {
		students = new_ids;
		console.log(new_ids);
	}
</script>

{#if draft_mode}
	<div>...En attente d'approbation</div>
	<div>
		<div>Attention</div>
		<div>
			Seulement un brouillon peut être en attente à la fois. Si tu soumets une nouvelle version, la
			précédente sera écrasée.
		</div>
	</div>
{/if}
<div class="sticky top-0 mb-12 flex items-center justify-between gap-x-gap border-b pb-gap-y">
	<div class="text-xl font-semibold">
		{#if virgin}
			Brouillon
		{:else}
			{project?.name}
		{/if}
	</div>
	<div>
		<Button disabled={!has_changed} variant="action" type="submit" form="form-submit-student-draft">
			Publier
		</Button>
	</div>
</div>

status
<br />
<form {onsubmit} id="form-submit-student-draft" class="space-y-gap-y">
	<Input name="name" label="titre" required bind:value={name} autocomplete="off" />
	<Textarea
		name="description"
		label="description"
		rows={6}
		required
		bind:value={description}
		autocomplete="off"
	/>

	<div>
		<Relation
			{...collection.field_map.students}
			value={project?.students || [virgin_from_student] || []}
			record={project}
			on_change={on_change_students}
			bind:onsubmit={onsubmit_students}
		></Relation>
	</div>

	<div>
		<File {...collection.field_map.files} value={project?.students} />
	</div>
</form>
<br />
files

<br />
Invite other students

<!-- <Info /> -->
