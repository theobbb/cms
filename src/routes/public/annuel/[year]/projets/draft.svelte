<script lang="ts">
	import { use_pocketbase } from '$lib/pocketbase';
	import { use_toaster } from '$lib/logic/toaster.svelte';
	import Button from '$lib/ui/button.svelte';
	import File from '$lib/ui/editor/fields/file.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';

	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { apps } from '$config/apps';
	import type { SubmitCallback } from '$config/field.types';

	// 1. Destructure props
	let { collection, project, draft, virgin } = $props();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const draft_mode = $derived(draft?.id);
	const virgin_from_student = $derived(page.url.searchParams.get('student'));

	// 2. Reactive State
	// We initialize with defaults, but we use an effect to sync if props change
	let name = $state('');
	let description = $state('');
	let students = $state<string[]>([]);
	let tags = $state<any[]>([]);
	let is_submitting = $state(false); // 5. Added loading state

	$inspect(project, draft);
	// 3. Sync State when navigating between projects or loading data
	$effect(() => {
		name = draft?.name || project?.name || '';
		description = draft?.description || project?.description || '';

		// Handle student initialization logic
		const existing_students = draft?.students || project?.students || [];
		if (virgin && virgin_from_student && existing_students.length === 0) {
			// If it's a new draft for a specific student, set it immediately
			students = [virgin_from_student];
		} else {
			students = existing_students;
		}

		tags = draft?.tags || [];
	});

	// Optional: Fetch student details only if needed for display within the Relation component
	// Assuming Relation handles fetching based on ID, this might not be needed.
	// If you explicitly need the expand object, keep this, but don't mutate 'project'.

	// 4. Dirty Checking
	const has_changed = $derived(
		name !== (draft?.name || project?.name) ||
			description !== (draft?.description || project?.description) ||
			JSON.stringify(students) !== JSON.stringify(draft?.students || project?.students) ||
			JSON.stringify(tags) !== JSON.stringify(draft?.tags || [])
	);

	let onsubmit_students: SubmitCallback<any> = $state(() => {});

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		if (is_submitting) return;
		is_submitting = true;

		const form_data = new FormData(event.currentTarget, event.submitter);

		// Manual form data overrides
		form_data.set('tags', JSON.stringify(tags));

		// Handle Relation specific submit logic
		await onsubmit_students(form_data, () => {});

		try {
			let target_id = draft?.id;

			if (target_id) {
				// Update existing draft
				await pocketbase.collection('project_drafts').update(target_id, form_data);
			} else {
				// Create new draft
				if (!virgin && project?.id) {
					// Link to original project if this isn't a brand new creation
					form_data.set('id', project.id);
				}
				const new_draft = await pocketbase.collection('project_drafts').create(form_data);
				target_id = new_draft.id;
			}

			toaster.push('success', 'Merci!');
			await invalidate('data:project_draft');

			if (virgin) {
				goto(`/public/${page.params.year}/projets/${target_id}`);
			}
		} catch (err) {
			console.error(err);
			toaster.push('error', 'Une erreur est survenue');
		} finally {
			is_submitting = false;
		}
	}

	function on_change_students(new_ids: string[]) {
		students = new_ids;
	}
</script>

{#if draft_mode}
	<div class="mb-4 rounded bg-yellow-100 p-4 text-yellow-800">
		<div class="font-bold">...En attente d'approbation</div>
		<div class="mt-1 text-sm">
			Attention: Seulement un brouillon peut être en attente à la fois. Si tu soumets une nouvelle
			version, la précédente sera écrasée.
		</div>
	</div>
{/if}

<div
	class="sticky top-0 z-10 mb-12 flex items-center justify-between gap-x-gap border-b bg-white/90 pb-gap-y backdrop-blur"
>
	<div class="text-xl font-semibold">
		{virgin ? 'Nouveau Brouillon' : draft?.name || project?.name}
	</div>
	<div>
		<Button
			disabled={!has_changed || is_submitting}
			variant="action"
			type="submit"
			form="form-submit-student-draft"
		>
			Publier
		</Button>
	</div>
</div>

<form {onsubmit} id="form-submit-student-draft" class="space-y-gap-y">
	<Input name="name" label="Titre" required bind:value={name} autocomplete="off" />

	<Textarea
		name="description"
		label="Description"
		rows={6}
		required
		bind:value={description}
		autocomplete="off"
	/>

	<div>
		<Relation
			{...collection.field_map.students}
			value={students}
			record={project}
			on_change={on_change_students}
			bind:onsubmit={onsubmit_students}
		></Relation>
	</div>

	<div>
		<File {...collection.field_map.files} value={draft?.files || project?.files} />
	</div>
</form>
