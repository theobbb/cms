<script lang="ts">
	import Textarea from '$lib/ui/components/form/fields/textarea.svelte';
	import Socials, { type Social } from './socials.svelte';
	import { page } from '$app/state';
	import DraftHeader from '../../draft-header.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import Info from '$lib/ui/templates/box/info.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';
	import { goto, invalidate } from '$app/navigation';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte.js';
	import { ClientResponseError, type RecordModel } from 'pocketbase';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte.js';
	import { use_pocketbase } from '$lib/pocketbase.js';
	import SortableList from '$lib/ui/components/sortable-list.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';

	const { data } = $props();
	const { collections } = $derived(data);

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const editor = use_editor();
	const record = $derived(editor?.current?.method == 'update' ? editor?.current?.record : null);

	const id = $derived(page.url.searchParams.get('id'));
	const virgin = $derived(!page.url.searchParams.has('id'));

	//const projects = $derived(record?.expand?.['projects(students)']);

	let projects: RecordModel[] = $state([]);

	let socials: Social[] = $state(record?.socials || []);

	$inspect(projects);
	const pop_socials = new Pop();

	const has_changed = true;

	const form_action = init_form_action();

	type DraftRecord =
		| (RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean })
		| null;

	const onsubmit = form_action.submit(async ({ form_data }) => {
		const body = {
			...Object.fromEntries(form_data),
			socials,
			sort_projects: [...projects].map((p) => p.id),
			id: record?.draft ? record.id : undefined,
			draft_of: record?.draft ? record.draft_of : record?.id || null,
			draft: true,
			is_latest: true,
			year: page.params.year
		};

		const res = await fetch(`/public/${page.params.year}/api/draft?collection=students`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			// 1. Safely parse the JSON (fallback to null if the server crashed hard)
			const error_data = await res.json().catch(() => null);

			// 2. Bypass the constructor's auto-unwrapping
			const pb_err = new ClientResponseError();
			pb_err.response = error_data || { message: 'Erreur serveur inattendue' };

			// 3. Throw it so form-action catches it
			throw pb_err;
		}
		const new_record: DraftRecord = await res.json();

		form_action.toaster.push('success', `Brouillon enregistré.`);

		if (new_record) {
			editor.open({ method: 'update', record: new_record });
			goto(`/public/${page.params.year}/finissant-es/draft?editor=update&record=${new_record.id}`);
		}
	});

	async function get_projects() {
		// 1. Determine which ID actually owns the projects.
		// If we are in a draft, projects are likely still linked to the 'draft_of' ID.
		const targetId = record?.draft_of || record?.id;

		if (!targetId) {
			projects = [];
			return;
		}

		const fetchedProjects = await pocketbase.collection('projects').getFullList({
			filter: `students ~ "${targetId}"`
		});

		const sortOrder: string[] = record?.sort_projects || [];

		// Use a new reference to trigger Svelte's reactivity properly
		const sorted = [...fetchedProjects].sort((a, b) => {
			let indexA = sortOrder.indexOf(a.id);
			let indexB = sortOrder.indexOf(b.id);
			if (indexA === -1) indexA = 999;
			if (indexB === -1) indexB = 999;
			return indexA - indexB;
		});

		projects = sorted;
	}
	$effect(() => {
		if (record) get_projects();
	});

	async function on_reorder_projects(new_projects: RecordModel[]) {
		if (!record?.id) return;
		const new_sort = [...new_projects].map((p) => p.id);
		console.log(new_sort);
		await pocketbase.collection('students').update(record.id, { sort_projects: new_sort });
		toaster.push('success', 'Ordre de projets enregistré.');
	}
</script>

<form {onsubmit} class="space-y-6">
	<DraftHeader {record} {has_changed}>
		{#if record}
			{record?.first_name}
			{record?.last_name}
		{/if}
	</DraftHeader>

	<!-- <Info /> -->

	<Input name="first_name" label="Prénom" required value={record?.first_name} />
	<Input name="last_name" label="Nom" required value={record?.last_name} />
	<Input name="pronouns" label="Pronoms" value={record?.last_name} />

	<Textarea name="description" label="description" rows={8} value={record?.description} />
	<div>
		<Relation
			{...collections.students.field_map.program}
			label="programme"
			{record}
			value={record?.program}
		/>
	</div>
	<div class="space-y-3">
		<div>
			<div class="">
				<!-- <OrderList
		items={socials}
		add_item_text="Ajouter un lien"
		label="liens"
		on_add_item={pop_socials.show}
		on_remove_item={() => socials = socials.filter((i) => i != item)}
	>
		{#snippet item_renderer(social: Social)}
			<div class="py-1.5">
				<div>{social.name}</div>
				<div class="text-foreground-muted">{social.url}</div>
			</div>
		{/snippet}
	</OrderList> -->
			</div>
			<Socials bind:socials />
		</div>
	</div>

	{#if editor.current?.method == 'update'}
		<div class="mb-gap mt-12 flex items-center justify-between border-b py-3">
			<div class="text-xl">Projets</div>

			<a class="text-indigo-600" href="/public/{page.params.year}/projets/draft?editor=create">
				Nouveau projet +
			</a>
		</div>

		<div>
			<SortableList
				items={projects}
				multiple={true}
				on_reorder={(new_projects) => {
					projects = new_projects;
				}}
				class={['divide-y border border-b-0 px-3']}
			>
				{#snippet children(project, i)}
					<div>
						{project.name}
					</div>
				{/snippet}
			</SortableList>
		</div>
	{:else}
		<Info>Tu pourras ajouter tes projets une fois que ton brouillon sera validé.</Info>
	{/if}
</form>
