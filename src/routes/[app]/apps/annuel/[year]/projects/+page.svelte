<script lang="ts">
	import { page } from '$app/state';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import Button from '$lib/ui/components/button.svelte';
	import DataTable from '$lib/ui/data-table/section-table.svelte';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte.js';

	const { data } = $props();
	const toaster = use_toaster();
	const editor = use_editor();

	editor.defaults.year = page.params.year || '';

	data.collections.projects.field_map.students.query = { filter: `year = "${page.params.year}"` };

	const fields = $derived([
		{ name: 'link', type: 'snippet', snippet: draft_link, table_only: true },
		...data.collections.projects.fields
	]);

	async function copy_link(id: string) {
		const url = page.url.host + '/public/' + page.params.year + '/projets?draft=' + id;
		await navigator.clipboard.writeText(url);

		toaster.push('info', url + ' copied to clipboard');
	}
</script>

{#snippet draft_link(item: any)}
	<Button
		href="/public/{page.params.year}/projets/draft?id={item.id}"
		icon="icon-[ri--draft-line]"
		variant="ghost"
		target="_blank"
		tooltip="Ouvrir le brouillon"
	/>
{/snippet}
<DataTable
	collection={{ ...data.collections.projects, fields }}
	query={{ sort: 'created', filter: `year = "${page.params.year}"` }}
/>
