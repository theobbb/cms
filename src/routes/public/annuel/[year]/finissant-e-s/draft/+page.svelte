<script lang="ts">
	import Info from './info.svelte';
	import type { Social } from '$lib/types';
	import Button from '$lib/ui/button.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import Socials from './socials.svelte';
	import { page } from '$app/state';
	import DraftHeader from '../../draft-header.svelte';
	import { DraftManager } from '../../draft.svelte.js';
	import Input from '$lib/ui/form/input.svelte';

	const { data } = $props();
	const { student, draft } = $derived(data);

	const id = $derived(page.url.searchParams.get('id'));
	const virgin = $derived(!page.url.searchParams.has('id'));

	const projects = $derived(student?.expand?.['projects(students)']);

	// --- 1. Form Data State ---
	const initial_desc = draft?.description || student?.description;
	const initial_socials = JSON.stringify(draft?.socials || []);

	let description = $state(initial_desc);
	let socials = $state(draft?.socials || []) as Social[];

	// --- 2. Change Detection ---
	const has_changed = $derived(
		description !== initial_desc || JSON.stringify(socials) !== initial_socials
	);

	// --- 3. Submission Handler ---
	const manager = new DraftManager({
		collection: 'student_drafts',
		invalidate_key: 'data:student_draft'
	});

	async function onsubmit(e: any) {
		await manager.handle_submit(e, {
			draft_id: draft?.id,
			live_record_id: student?.id,
			is_new_creation: virgin,
			process_data: (fd) => {
				fd.set('socials', JSON.stringify(socials));
			}
		});
	}
</script>

<form {onsubmit} class="space-y-6">
	<DraftHeader {draft} {has_changed} is_virgin_record={virgin}>
		{#if student}
			{student?.first_name}
			{student?.last_name}
		{/if}
	</DraftHeader>

	<Info />

	<Input name="first_name" label="Prénom" required />
	<Input name="last_name" label="Nom" required />
	<Textarea name="description" label="description" rows={6} required bind:value={description} />

	<div>
		<div>Tu peux ajouter des liens vers tes réseaux sociaux (optionel)</div>
		<div>
			<Socials bind:socials />
		</div>
	</div>
	{#if !virgin}
		<div class="mt-12 mb-gap flex items-center justify-between border-b py-3">
			<div class="text-xl">Projets</div>

			<a class="text-indigo-600" href="/public/{page.params.year}/projets/draft?student={id}">
				Nouveau projet +
			</a>
		</div>

		<div>
			{#each projects as project}
				<div>
					<a class="" href="/public/{page.params.year}/projets/draft?id={project.id}">
						{project.name}
					</a>
				</div>
			{/each}
		</div>
	{:else}
		Virgin
	{/if}
</form>
