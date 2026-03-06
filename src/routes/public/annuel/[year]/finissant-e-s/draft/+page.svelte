<script lang="ts">
	import Textarea from '$lib/ui/components/form/fields/textarea.svelte';
	import Socials from './socials.svelte';
	import { page } from '$app/state';
	import DraftHeader from '../../draft-header.svelte';
	import { DraftManager } from '../../draft.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Info from '$lib/ui/templates/box/info.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';
	import { goto } from '$app/navigation';

	type Social = { name: string; url: string };

	const { data } = $props();
	const { student, collections } = $derived(data);

	const id = $derived(page.url.searchParams.get('id'));
	const virgin = $derived(!page.url.searchParams.has('id'));

	const projects = $derived(student?.expand?.['projects(students)']);

	let socials: Social[] = $state(student?.socials || []);

	$inspect(student);

	const has_changed = true;

	const form_action = init_form_action();

	const onsubmit = form_action.submit(async ({ form_data }) => {
		const root_id = student?.draft_of || student?.id;
		if (root_id) {
			form_data.set('draft_of', student.id);

			// Get all records in this group and set is_latest to false
			// const siblings = await form_action.pocketbase.collection('students').getFullList({
			// 	filter: `draft_of = "${root_id}" || id = "${root_id}"`
			// });

			// await Promise.all(
			// 	siblings.map((s) =>
			// 		form_action.pocketbase.collection('students').update(s.id, { is_latest: false })
			// 	)
			// );
		}
		form_data.set('year', page.params.year || '');
		form_data.set('draft', 'true');
		form_data.set('is_latest', 'true');

		const next_version = student ? Number(student.draft_version) + 1 || 0 : 0;
		form_data.set('draft_version', String(next_version));
		const created = await form_action.pocketbase.collection('students').create(form_data);

		form_action.toaster.push('success', `Brouillon v${next_version} envoyé.`);

		goto(`/public/${page.params.year}/finissant-e-s/draft?id=${created.id}`);

		if (root_id) fetch(`/public/${page.params.year}/api/update-is-latest?id=${root_id}`);
	});
</script>

<form {onsubmit} class="space-y-6">
	<DraftHeader record={student} {has_changed}>
		{#if student}
			{student?.first_name}
			{student?.last_name}
		{/if}
	</DraftHeader>

	<!-- <Info /> -->

	<Input name="first_name" label="Prénom" required value={student?.first_name} />
	<Input name="last_name" label="Nom" required value={student?.last_name} />
	<Textarea name="description" label="description" rows={6} required value={student?.description} />

	<div class="space-y-3">
		<Info>Tu peux ajouter des liens vers tes réseaux sociaux ou autres ressources (optionel)</Info>

		<div>
			<Socials bind:socials />
		</div>
	</div>
	<div>
		<Relation
			{...collections.students.field_map.program}
			label="programme"
			record={student}
			value={student?.program}
		/>
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
		<Info>Tu pourras ajouter tes projets une fois que ton brouillon sera validé.</Info>
	{/if}
</form>
