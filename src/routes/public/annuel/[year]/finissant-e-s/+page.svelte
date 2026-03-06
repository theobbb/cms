<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import type { RecordModel } from 'pocketbase';
	import Guide from './guide.svelte';
	import DataTable from '$lib/ui/data-table/section-table.svelte';
	import TableCollection from '$lib/ui/data-table/table-collection.svelte';
	import { goto } from '$app/navigation';
	import Search from '$lib/ui/components/search.svelte';

	const { data } = $props();

	// const columns = data.collections.students.field_map;

	// columns.draft.hidden = true;
	// columns.draft_of.label = 'status';
	// columns.draft_of.snippet = status;

	// columns.scholarship.hidden = true;
	// columns.draft_version.hidden = true;
	// columns.year.hidden = true;
	// columns.socials.hidden = true;
	// const { draft_map } = $derived(data);

	$inspect(data);
</script>

<Guide />

<div class="grid grid-cols-[auto_1fr_auto] items-center gap-8">
	<div class="text-xl">Finissant-e-s {page.params.year} - Liste communautaire</div>
	<div class="w-full"><Search url_param="search" /></div>
	<div>
		<span class="text-muted mr-1">Pas encore dans la liste?</span>

		<a class="text-indigo-600" href="/public/{page.params.year}/finissant-e-s/draft">
			Inscription →
		</a>
	</div>
</div>
<!-- <TableCollection collection={data.collections.student_drafts} /> -->
<TableCollection
	collection={data.collections.students}
	query={{ filter: `year = "${page.params.year}" && is_latest = true`, sort: '-updated' }}
	hidden="draft_of, scholarship, draft_version, year, socials, is_latest"
	overrides={{
		draft: { label: 'status', snippet: status }
	}}
	row_props={(row) => ({
		onclick: () => goto(`/public/${page.params.year}/finissant-e-s/draft?id=${row.id}`)
	})}
/>

{#snippet status(student: RecordModel)}
	<div>
		{#if student.draft}
			<Box color={student.draft_of ? 'green' : 'blue'}>
				<div class="px-1 text-xs">
					{student.draft_of ? 'Nouveau' : `En attente d'approbation`}
				</div>
			</Box>
		{/if}
	</div>
{/snippet}

<Button href="/public/{page.params.year}/projets/draft">Nouveau projet</Button>
<div class="relative">
	<div class="bg-background sticky top-0 flex items-center justify-between border-b py-3">
		<div class="text-xl">Finissant-e-s {page.params.year}</div>

		<div>
			<span class="text-muted mr-1">Pas encore dans la liste?</span>

			<a class="text-indigo-600" href="/public/{page.params.year}/finissant-e-s/draft">
				Inscription →
			</a>
		</div>
	</div>

	<!-- <div class="mt-8">
		{#each data.combined as student}
			<div class="flex items-center justify-between">
				<a href="/public/{page.params.year}/finissant-e-s/draft?id={student.id}">
					{student.last_name},
					{student.first_name}
				</a>
				{#if student.has_pending_draft}
					<Box color={student.pending_draft_type == 'new_request' ? 'green' : 'blue'}>
						<div class="px-1 text-xs">
							{student.pending_draft_type == 'new_request' ? 'Nouveau' : `En attente d'approbation`}
						</div>
					</Box>
				{/if}
			</div>
		{/each}
	</div> -->
</div>
