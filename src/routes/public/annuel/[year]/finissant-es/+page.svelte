<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import type { RecordModel } from 'pocketbase';
	import TableCollection from '$lib/ui/data-table/table-collection.svelte';
	import { goto } from '$app/navigation';
	import Search from '$lib/ui/components/search.svelte';
	import { process_collection } from '$config/utils.js';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte.js';
	import DraftStatus from '../draft-status.svelte';

	const { data } = $props();

	const editor = use_editor();
</script>

<!-- <Guide /> -->

<div class="text-right">
	<span class="mr-1 text-foreground-muted">Pas encore dans la liste ?</span>

	<a
		class="text-indigo-600 dark:text-indigo-400"
		href="/public/{page.params.year}/finissant-es/draft"
		onclick={() => {
			editor.open({ method: 'create' });
		}}
	>
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
					'year,draft_of,draft_version,is_latest,headshot,pronouns,description,scholarship,socials,updated,program,sort_projects',
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
			onclick: () => {
				editor.open({ method: 'update', record: row });
				goto(`/public/${page.params.year}/finissant-es/draft?editor=update&record=${row.id}`);
			}
		})}
	/>
</div>

{#snippet status(record: RecordModel)}
	<DraftStatus {record} />
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
