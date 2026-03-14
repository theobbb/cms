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
	collection={process_collection(data.collections.students, {
		title: 'Finissant-e-s',
		record_title: 'Finissant-e',
		fields: {
			hidden: 'year,draft_of,draft_version,is_latest,draft',
			labels: {
				first_name: 'prénom',
				last_name: 'nom',
				program: 'programme',
				scholarship: 'bourse',
				socials: 'liens',
				created: 'créé',
				updated: 'modifié'
			},
			overrides: {
				description: {
					rows: 6
				}
			},
			snippets: {
				status: { snippet: draft_status, label: 'status', display: 'table' }
			}
		}
	})}
	query={{
		filter: `year = "${page.params.year}" && is_latest = true`,
		sort: '-created'
	}}
	{onsubmit}
/>

{#snippet draft_status(student: RecordModel)}
	<DraftStatus record={student} />
	<!-- <Button variant="none">
		<div>

		</div>
	</Button> -->
	<!-- <Button
		href="/public/{page.params.year}/finissant-e-s/draft?id={item.id}"
		icon="icon-[ri--draft-line]"
		variant="ghost"
		target="_blank"
		tooltip="Ouvrir le brouillon"
	/> -->
{/snippet}
