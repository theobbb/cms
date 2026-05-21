<script lang="ts">
	import { page } from '$app/state';
	import { process_collection } from '$config/utils';
	import DraftStatus from '$lib/apps/annuel/draft-status.svelte';
	import SectionTable from '$lib/ui/data-table/section-table.svelte';
	import type { EditorFormActionContext } from '$lib/ui/editor/editor.svelte';
	import type { RecordModel } from 'pocketbase';

	const { data } = $props();

	async function onsubmit(ctx: EditorFormActionContext) {
		const { form_data, method } = ctx;
		if (method == 'create') {
			form_data.set('year', page.params.year || '');
			form_data.set('is_latest', 'true');
		}
	}
</script>

<SectionTable
	collection={process_collection(data.collections.projects, {
		title: 'Projets',
		record_title: 'Projet',
		fields: {
			hidden: 'year,draft_of,draft_version,is_latest,tags',
			labels: {
				name: 'nom',
				students: 'finissant-e-s',
				files: 'fichiers',
				created: 'créé',
				updated: 'modifié'
			},
			overrides: {
				description: { rows: 4 },
				students: {
					query: { sort: 'created', filter: `year = "${page.params.year}" && draft = false` }
				},
				background: { type: 'color' }
			},
			snippets: {
				status: { snippet: draft_status, label: 'status' }
			}
		}
	})}
	query={{ sort: 'created', filter: `year = "${page.params.year}"` }}
	{onsubmit}
/>
{#snippet draft_status(record: RecordModel)}
	<DraftStatus {record} />
{/snippet}
