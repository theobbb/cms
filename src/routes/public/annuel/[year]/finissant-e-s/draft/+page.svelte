<script lang="ts">
	import type { Social } from '$lib/types';
	import Button from '$lib/ui/styled/button.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import Socials from './socials.svelte';
	import { page } from '$app/state';
	import DraftHeader from '../../draft-header.svelte';
	import { DraftManager } from '../../draft.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Box from '$lib/components/box.svelte';
	import Info from '$lib/ui/templates/box/info.svelte';

	const { data } = $props();
	const { student, draft, collections } = $derived(data);

	const id = $derived(page.url.searchParams.get('id'));
	const virgin = $derived(!page.url.searchParams.has('id'));

	const projects = $derived(student?.expand?.['projects(students)']);

	$inspect(student, draft, collections);

	const stable = (obj: object) => JSON.stringify(obj, Object.keys(obj).sort());

	// const has_changed = $derived(stable(draft_data) !== stable(live_data));

	const fields = {
		first_name: '',
		last_name: '',
		description: '',
		socials: [] as Social[]
	};
	function resolve(val: unknown, fallback: unknown) {
		if (typeof val === 'string' && typeof fallback !== 'string') {
			try {
				return JSON.parse(val);
			} catch {
				return fallback;
			}
		}
		return val ?? fallback;
	}

	const initial = $derived(
		Object.fromEntries(
			Object.entries(fields).map(([k, fallback]) => [
				k,
				resolve(draft?.data?.[k] ?? student?.[k], fallback)
			])
		)
	);

	let values = $state({ ...initial });

	const has_changed = $derived(stable(values) !== stable(initial));

	// --- 3. Submission Handler ---
	const manager = new DraftManager({
		collection: 'students',
		invalidate_key: 'data:student_draft'
	});

	async function onsubmit(e: any) {
		await manager.on_submit(e, {
			draft,
			record: student,
			process_data: (fd) => fd.set('socials', JSON.stringify(values.socials))
		});
	}
</script>

<form {onsubmit} class="space-y-6">
	<DraftHeader {draft} {has_changed} is_virgin_record={virgin}>
		{#if draft}
			{draft.data.first_name}
			{draft.data.last_name}
		{:else if student}
			{student?.first_name}
			{student?.last_name}
		{/if}
	</DraftHeader>

	<!-- <Info /> -->

	<Input name="first_name" label="Prénom" required bind:value={values.first_name} />
	<Input name="last_name" label="Nom" required bind:value={values.last_name} />
	<Textarea
		name="description"
		label="description"
		rows={6}
		required
		bind:value={values.description}
	/>

	<div class="space-y-3">
		<Info>Tu peux ajouter des liens vers tes réseaux sociaux ou autres ressources (optionel)</Info>

		<div>
			<Socials bind:socials={values.socials} />
		</div>
	</div>
	<div>
		<Relation {...collections.students.field_map.program} label="programme" record={student} />
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
