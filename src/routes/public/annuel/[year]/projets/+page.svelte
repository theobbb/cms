<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import type { RecordModel } from 'pocketbase';

	import TableCollection from '$lib/ui/data-table/table-collection.svelte';
	import { goto } from '$app/navigation';
	import Search from '$lib/ui/components/search.svelte';
	import { process_collection } from '$config/utils.js';

	const { data } = $props();
</script>

<div>
	<div class="mb-2 w-full"><Search url_param="search" /></div>
	<TableCollection
		collection={process_collection(data.collections.projects, {
			title: 'Finissant-e-s',
			record_title: 'Finissant-e',
			fields: {
				hidden: 'year,draft_of,draft_version,is_latest,description,updated,tags,files',
				labels: {
					name: 'nom',
					created: 'modifié',
					students: 'finissant-e-s'
				},
				overrides: {
					students: {
						query: { sort: 'created', filter: `year = "${page.params.year}"` }
					}
				}
			}
		})}
		query={{ filter: `year = "${page.params.year}" && is_latest = true`, sort: '-updated' }}
		row_props={(row) => ({
			onclick: () => goto(`/public/${page.params.year}/projets/draft?id=${row.id}`)
		})}
	/>
</div>
