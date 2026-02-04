<script lang="ts">
	import { page } from '$app/state';
	import type { StudentDraftsRecord, StudentsRecord } from '$config/apps/annuel/types';
	import { use_pocketbase } from '$lib/pocketbase';
	import Draft from './draft.svelte';

	const pocketbase = use_pocketbase();

	let student: StudentsRecord | null = $state(null);
	let draft: StudentDraftsRecord | null = $state(null);

	async function load() {
		if (!page.params.draft) return;
		student = await pocketbase.collection('students').getOne(page.params.draft);

		try {
			draft = await pocketbase.collection('student_drafts').getOne(page.params.draft);
		} catch (error) {}
		loading = false;
	}
	$effect(() => {
		load();
	});
	let loading = $state(true);
</script>

{#if loading}
	loading
{:else if student}
	<Draft {student} {draft} />
{:else}
	Introuvable
{/if}
