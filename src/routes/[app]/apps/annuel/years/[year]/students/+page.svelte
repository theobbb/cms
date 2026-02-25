<script lang="ts">
	import { page } from '$app/state';
	import DataTable from '$lib/ui/data-table/data-table.svelte';

	const { data } = $props();
</script>

<DataTable
	collection={data.collections.students}
	query={{ sort: 'created', filter: `year = "${page.params.year}"` }}
/>
