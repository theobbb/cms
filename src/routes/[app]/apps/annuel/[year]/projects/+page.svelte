<script lang="ts">
	import { page } from '$app/state';
	import { use_toaster } from '$lib/logic/toaster.svelte.js';
	import Button from '$lib/ui/button.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';

	const { data } = $props();
	const toaster = use_toaster();

	const fields = $derived([
		{ name: 'link', type: 'snippet', snippet: draft_link, table_only: true },
		...data.collections.projects.fields
	]);
	async function copy_link(id: string) {
		const url = page.url.host + '/public/' + page.params.year + '/projets/' + id;
		await navigator.clipboard.writeText(url);

		toaster.push('info', url + ' copied to clipboard');
	}
</script>

{#snippet draft_link(item: any)}
	<Button
		icon="icon-[ri--draft-line]"
		variant="ghost"
		onclick={(event) => {
			event.stopPropagation();
			copy_link(item.id);
		}}
	></Button>
{/snippet}
<DataTable
	collection={{
		...data.collections.projects,
		fields,
		query: { sort: 'created', filter: `year = "${page.params.year}"` }
	}}
/>
