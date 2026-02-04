<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { use_toaster } from '$lib/logic/toaster.svelte';
	import { use_pocketbase } from '$lib/pocketbase';

	import type { Social } from '$lib/types';
	import Button from '$lib/ui/button.svelte';
	import Relation from '$lib/ui/data-table/drawer/fields/relation.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import Socials from './socials.svelte';

	const { data } = $props();
	const { student, draft } = $derived(data);

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();
	// Store initial values
	const initial_description = draft?.description || student.description;
	const initial_socials = JSON.stringify(draft?.socials || []);

	let description = $state(initial_description);
	let socials = $state(draft?.socials || []) as Social[];

	const has_changed = $derived(
		description !== initial_description || JSON.stringify(socials) !== initial_socials
	);

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form_data = new FormData(event.currentTarget, event.submitter);

		const socials_json = JSON.stringify(socials);
		form_data.set('socials', socials_json);

		console.log(form_data);
		try {
			if (draft?.id) await pocketbase.collection('student_drafts').update(draft.id, form_data);
			else {
				form_data.set('id', student.id);
				console.log(form_data);

				await pocketbase.collection('student_drafts').create(form_data);
			}

			toaster.push('success', 'Merci!');
			invalidate('data:student_draft');
		} catch (err) {
			toaster.push('error');
		}
	}
</script>

<div class="mx-auto max-w-xl space-y-gap-y">
	<div class="sticky top-0 mb-12 flex items-center justify-between gap-x-gap border-b pb-gap-y">
		<div class="text-xl">
			{student.first_name}
			{student.last_name}
		</div>
		<div>
			<Button
				disabled={!has_changed}
				variant="action"
				type="submit"
				form="form-submit-student-draft">Publier</Button
			>
		</div>
	</div>
	<div>
		<Socials bind:socials />
	</div>
	status
	<br />
	<form {onsubmit} id="form-submit-student-draft">
		<Textarea name="description" label="description" rows={6} required bind:value={description} />
	</form>

	<Button>Ajouter un projet</Button>
	socials
	<br />
	guide
	<br />
	Projects
	<br />
</div>

<!-- <div class="mx-auto my-12 max-w-md">
	<Relation
		on_change={(ids: string[]) => on_change_featured(ids)}
		type="relation"
		id="settings-featured"
		name="featured"
		value={draft.id}
		label="En vedette"
		display_key="title"
		collection="student_drafts"
		expand={data.featured}
	/>
</div> -->
