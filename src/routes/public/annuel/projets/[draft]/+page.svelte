<script lang="ts">
	import { page } from '$app/state';
	import type { ProjectDraftsRecord, ProjectsRecord } from '$config/apps/annuel/types';
	import { use_pocketbase } from '$lib/pocketbase';
	import Draft from './draft.svelte';

	const pocketbase = use_pocketbase();

	let project: ProjectsRecord | null = $state(null);
	let draft: ProjectDraftsRecord | null = $state(null);

	async function load_draft() {
		if (!page.params.draft) return;
		project = await pocketbase.collection('projects').getOne(page.params.draft);

		try {
			draft = await pocketbase.collection('project_drafts').getOne(page.params.draft);
		} catch (error) {}
		loading = false;
	}
	$effect(() => {
		load_draft();
	});
	let loading = $state(true);
</script>

{#if loading}
	loading
{:else if project}
	<Draft {project} {draft} />
{:else}
	Introuvable
{/if}
