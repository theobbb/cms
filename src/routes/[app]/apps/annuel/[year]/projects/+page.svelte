<script lang="ts">
	import { page } from '$app/state';
	import { process_collection } from '$config/utils';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import DraftStatus from '$lib/apps/annuel/draft-status.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import SectionTable from '$lib/ui/data-table/section-table.svelte';
	import type { EditorFormActionContext } from '$lib/ui/editor/editor.svelte';
	import type { CollectionField } from 'pocketbase';

	const { data } = $props();
	const toaster = use_toaster();

	async function copy_link(id: string) {
		const url = page.url.host + '/public/' + page.params.year + '/projets?draft=' + id;
		await navigator.clipboard.writeText(url);

		toaster.push('info', url + ' copied to clipboard');
	}

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
				students: {
					query: { sort: 'created', filter: `year = "${page.params.year}" && draft = false` }
				}
			},
			snippets: {
				status: { snippet: draft_status, label: 'status' }
			}
		}
	})}
	query={{ sort: 'created', filter: `year = "${page.params.year}"` }}
	{onsubmit}
/>
{#snippet draft_status(record: CollectionField)}
	<DraftStatus {record} />
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
