<script lang="ts">
	import { use_pocketbase } from '$lib/pocketbase';
	import { use_toaster } from '$lib/logic/toaster.svelte';
	import Button from '$lib/ui/button.svelte';
	import File from '$lib/ui/editor/fields/file.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import Info from './info.svelte';
	import { invalidate } from '$app/navigation';
	import { set_collection } from '$lib/logic/ctx.svelte';
	import type { SubmitCallback } from '$config/field.types.js';
	import Draft from '../draft.svelte';

	const { data } = $props();
	const { collections, project, draft } = $derived(data);

	const draft_mode = $derived(draft?.id);

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

		console.log(form_data);
		try {
			if (draft?.id) await pocketbase.collection('project_drafts').update(draft.id, form_data);
			else {
				form_data.set('id', project.id);
				console.log(form_data);

				await pocketbase.collection('project_drafts').create(form_data);
			}

			toaster.push('success', 'Merci!');
			invalidate('data:project_draft');
		} catch (err) {
			toaster.push('error');
		}
	}

	function on_change_students(new_ids: string[]) {
		students = new_ids;
		console.log(new_ids);
	}
</script>

<Draft collection={collections.projects} {project} {draft} />
