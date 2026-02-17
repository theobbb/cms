<script lang="ts">
	import { use_pocketbase } from '$lib/pocketbase';
	import Info from './info.svelte';
	import { invalidate } from '$app/navigation';
	import { use_toaster } from '$lib/logic/toaster.svelte';
	import type { Social } from '$lib/types';
	import Button from '$lib/ui/button.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import Socials from './socials.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import { page } from '$app/state';

	const { data } = $props();
	$inspect(data);

	const { collections, student, draft } = $derived(data);

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const draft_mode = $derived(draft?.id);

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

	const fields = $derived(collections.students.field_map);
</script>

<div>
	{#if draft_mode}
		En attente d'être approuvé
	{/if}
</div>
<a href="/public/{page.params.year}/finissant-e-s">Liste de finissant-e-s</a>
<div class="bg-bg sticky top-0 mb-12 flex items-center justify-between gap-x-gap border-b py-gap-y">
	<div class="text-2xl font-semibold">
		{student.first_name}
		{student.last_name}
	</div>
	<div>
		<Button disabled={!has_changed} variant="action" type="submit" form="form-submit-student-draft">
			Publier
		</Button>
	</div>
</div>

status
<br />
<form {onsubmit} id="form-submit-student-draft">
	<Textarea name="description" label="description" rows={6} required bind:value={description} />
</form>
<div>
	<div>Tu peux ajouter des liens vers tes réseaux sociaux (optionel)</div>
	<div>
		<Socials bind:socials />
	</div>
</div>
<div class="mt-12 mb-gap flex items-center justify-between">
	<div class="text-xl font-semibold">Projects</div>

	<Button href="/public/{page.params.year}/projets/draft?student={page.params.draft}"
		>Ajouter un projet</Button
	>
</div>

<div class="flex flex-col">
	{#each student.expand?.['projects(students)'] as project}
		<a
			class="w-full border-x border-b px-2.5 py-1.5 first:border-t"
			href="/public/{page.params.year}/projets/{project.id}"
		>
			{project.name}
		</a>
	{/each}
</div>

<Info />
