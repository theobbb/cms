<script lang="ts">
	import File from '$lib/ui/editor/fields/file.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { apps } from '$config/apps';
	import type { SubmitCallback } from '$config/field.types';
	import { DraftManager } from '../../draft.svelte.js';
	import DraftHeader from '../../draft-header.svelte';
	import type { RecordModel } from 'pocketbase';
	import Box from '$lib/components/box.svelte';

	const { data } = $props();
	let { collections, project, draft } = $derived(data);

	// --- 1. State Logic ---
	const virgin = $derived(!page.url.searchParams.has('id')); // Are we creating a brand new project?
	const virgin_student_id = $derived(page.url.searchParams.get('student'));

	let virgin_student: RecordModel | null = $state(null);
	// Fetch student info if creating new project from student profile
	$effect(() => {
		if (virgin && virgin_student_id) {
			fetch(apps.annuel.pocketbase.url + '/api/collections/students/records/' + virgin_student_id)
				.then((r) => r.json())
				.then((student) => {
					project = { expand: { students: [student] } };
				})
				.catch(() => {});
		}
	});

	// --- 2. Form Data State ---
	const initial_name = draft?.name || project?.name;
	const initial_desc = draft?.description || project?.description;
	const initial_students = draft?.students || project?.students;
	const initial_tags = JSON.stringify(draft?.tags || []);

	let name = $state(initial_name);
	let description = $state(initial_desc);
	let students = $state(initial_students);
	let tags = $state(draft?.tags || []);

	// --- 3. Change Detection ---
	const has_changed = $derived(
		name !== initial_name ||
			description !== initial_desc ||
			JSON.stringify(students) !== JSON.stringify(initial_students) ||
			JSON.stringify(tags) !== initial_tags
	);

	// --- 4. Submission Handler ---
	const manager = new DraftManager({
		collection: 'project_drafts',
		invalidate_key: 'data:project_draft'
	});

	let onsubmit_students: SubmitCallback<any> = $state(() => {});

	async function onsubmit(e: any) {
		await manager.on_submit(e, {
			draft_id: draft?.id,
			live_record_id: project?.id,
			virgin,
			process_data: async (fd) => {
				fd.set('tags', JSON.stringify(tags));
				// Run the relation component's internal submit logic
				await onsubmit_students(fd, () => {});
			},
			on_success: async (new_draft_id) => {
				// If we just created a brand new project draft, redirect to it
				if (virgin && new_draft_id) {
					goto(`/public/${page.params.year}/projets?id=${new_draft_id}`);
				}
			}
		});
	}

	function on_change_students(new_ids: string[]) {
		students = new_ids;
	}
</script>

<form {onsubmit} class="space-y-6">
	<DraftHeader {draft} {has_changed} is_virgin_record={virgin}>
		{project?.name}
	</DraftHeader>

	<Box color="yellow">
		<div>
			Assurez-vous d'avoir créé votre profil (et qu'il ait été validé) AVANT de créer vos projets.
		</div>
	</Box>

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
			{...collections.projects.field_map.students}
			value={project?.students || (virgin_student_id ? [virgin_student_id] : [])}
			record={project}
			on_change={on_change_students}
			bind:onsubmit={onsubmit_students}
		/>
	</div>

	<div class="mt-8">
		<div class="bg-blue text-blue-foreground mb-2 border px-3 py-2 text-sm">
			Directives upload files
		</div>
		<File {...collections.projects.field_map.files} value={project?.files} />
	</div>
</form>
