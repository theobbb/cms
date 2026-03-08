<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import type { RecordModel } from 'pocketbase';
	import Guide from './guide.svelte';
	import TableCollection from '$lib/ui/data-table/table-collection.svelte';
	import { goto } from '$app/navigation';
	import Search from '$lib/ui/components/search.svelte';
	import { process_collection } from '$config/utils.js';

	const { data } = $props();
</script>

<!-- <Guide /> -->

<div class="text-right">
	<span class="text-foreground-muted mr-1">Pas encore dans la liste?</span>

	<Button variant="action">Inscription →</Button>
	<a class="text-indigo-600" href="/public/{page.params.year}/finissant-e-s/draft">
		Inscription →
	</a>
</div>

<div>
	<div class="mb-2 w-full"><Search url_param="search" /></div>
	<TableCollection
		collection={process_collection(data.collections.students, {
			title: 'Finissant-e-s',
			record_title: 'Finissant-e',
			fields: {
				hidden:
					'year,draft_of,draft_version,is_latest,description,scholarship,socials,updated,program',
				labels: {
					first_name: 'prénom',
					last_name: 'nom',
					program: 'programme',
					created: 'modifié'
				},
				overrides: {
					draft: { label: 'status', snippet: status }
				}
			}
		})}
		query={{ filter: `year = "${page.params.year}" && is_latest = true`, sort: '-created' }}
		row_props={(row) => ({
			onclick: () => goto(`/public/${page.params.year}/finissant-e-s/draft?id=${row.id}`)
		})}
	/>
</div>

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
<!-- 
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
</div> -->
