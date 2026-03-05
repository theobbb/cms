<script lang="ts">
	import { page } from '$app/state';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import Button from '$lib/ui/components/button.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte';

	const { data } = $props();
	const toaster = use_toaster();
	const editor = use_editor();

	editor.defaults = { year: page.params.year || '' };

	const fields = $derived([
		{ name: 'link', type: 'snippet', snippet: draft_link, table_only: true },
		...data.collections.students.fields
	]);
	async function copy_link(id: string) {
		const url = page.url.host + '/public/' + page.params.year + '/finissant-e-s/' + id;
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
	collection={{ ...data.collections.students, fields }}
	query={{ sort: 'created', filter: `year = "${page.params.year}"` }}
	editor_defaults={{ year: page.params.year }}
/>
