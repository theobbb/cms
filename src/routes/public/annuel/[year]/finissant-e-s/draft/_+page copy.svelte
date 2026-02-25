<script lang="ts">
	import Info from './info.svelte';
	import type { Social } from '$lib/types';
	import Button from '$lib/ui/button.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import Socials from './socials.svelte';
	import { page } from '$app/state';
	import DraftHeader from '../../draft-header.svelte';
	import { DraftManager } from '../../draft.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Box from '$lib/components/box.svelte';

	const { data } = $props();
	const { student, draft, collections } = $derived(data);

	const id = $derived(page.url.searchParams.get('id'));
	const virgin = $derived(!page.url.searchParams.has('id'));

	const projects = $derived(student?.expand?.['projects(students)']);

	$inspect(student, draft, collections);

	const stable = (obj: object) => JSON.stringify(obj, Object.keys(obj).sort());

	// const has_changed = $derived(stable(draft_data) !== stable(live_data));

	const fields = ['first_name', 'last_name', 'description', 'socials'] as const;

	const initial = $derived(
		Object.fromEntries(fields.map((k) => [k, draft?.data?.[k] ?? student?.[k] ?? null]))
	);

	let values = $state({ ...initial });

	const has_changed = $derived(stable(values) !== stable(initial));

	// --- 3. Submission Handler ---
	const manager = new DraftManager({
		collection: 'student_drafts',
		invalidate_key: 'data:student_draft'
	});

	async function onsubmit(e: any) {
		await manager.on_submit(e, {
			draft,
			record: student,
			process_data: (fd) => {
				fd.set('socials', JSON.stringify(values.socials));
			}
		});
	}
</script>

<form {onsubmit} class="space-y-6">
	<DraftHeader {draft} has_changed={true} is_virgin_record={virgin}>
		{#if draft}
			{draft.data.first_name}
			{draft.data.last_name}
		{:else if student}
			{student?.first_name}
			{student?.last_name}
		{/if}
	</DraftHeader>

	<!-- <Info /> -->

	<Input name="first_name" label="Prénom" required bind:value={first_name} />
	<Input name="last_name" label="Nom" required bind:value={last_name} />
	<Textarea name="description" label="description" rows={6} required bind:value={description} />

	<div class="space-y-3">
		<Box color="blue" class="px-3 py-2 text-sm">
			Tu peux ajouter des liens vers tes réseaux sociaux ou autres ressources (optionel)
		</Box>
		<div>
			<Socials bind:values.socials />
		</div>
	</div>
	<div>
		<Relation {...collections.students.field_map.program} label="programme" />
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
		<Box color="blue">
			<div class="px-3 py-2 text-sm">
				<div>Tu pourras ajouter tes projets une fois que ton brouillon sera validé.</div>
			</div>
		</Box>
	{/if}
</form>
