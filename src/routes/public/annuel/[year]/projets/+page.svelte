<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import type { RecordModel } from 'pocketbase';

	import TableCollection from '$lib/ui/data-table/table-collection.svelte';
	import { goto } from '$app/navigation';
	import Search from '$lib/ui/components/search.svelte';
	import { process_collection } from '$config/utils.js';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte.js';

	const { data } = $props();

	const editor = use_editor();
</script>

<div class="text-right">
	<a
		onclick={() => {
			editor.open({ method: 'create' });
		}}
		class="text-indigo-600 dark:text-indigo-400"
		href="/public/{page.params.year}/projets/draft"
	>
		Ajouter un projet →
	</a>
</div>
<div>
	<div class="mb-2 w-full"><Search url_param="search" /></div>
	<TableCollection
		collection={process_collection(data.collections.projects, {
			title: 'Finissant-e-s',
			record_title: 'Finissant-e',
			fields: {
				hidden:
					'year,draft_of,draft_version,thumbnail,background,foreground_white,is_latest,description,updated,tags,files,teacher,class,session',
				labels: {
					name: 'nom',
					created: 'modifié',
					students: 'finissant-e-s'
				},
				overrides: {
					students: {
						query: { sort: 'created', filter: `year = "${page.params.year}"` }
					},
					draft: { label: 'status', snippet: status }
				}
			}
		})}
		query={{ filter: `year = "${page.params.year}" && is_latest = true`, sort: '-updated' }}
		row_props={(row) => ({
			onclick: () => {
				editor.open({ method: 'update', record: row });
				goto(`/public/${page.params.year}/projets/draft?editor=update&record=${row.id}`);
			}
		})}
	/>
</div>

{#snippet status(student: RecordModel)}
	<div>
		{#if student.draft}
			<div
				class={[
					'rounded-full- w-fit border border-current/50 px-1.5 py-px',
					student.draft_of ? 'bg-blue-200 text-blue-900 ' : 'bg-green-200 text-green-900'
				]}
			>
				<div class="text-xs">
					{student.draft_of ? `Modifié` : `Nouveau`}
				</div>
			</div>
		{/if}
	</div>
{/snippet}
