<script lang="ts">
	import { page } from '$app/state';
	import DataTable from '$lib/ui/data-table/data-table.svelte';

	const { data } = $props();
</script>

<DataTable
	collection={data.collections.projects}
	query={{ sort: 'created', filter: `year = "${page.params.year}"` }}
/>
