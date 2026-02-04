<script lang="ts">
	import { page } from '$app/state';
	import { collections } from '$config/apps/annuel/collections';

	import DataTable from '$lib/ui/data-table/data-table.svelte';
</script>

<DataTable
	collection={{
		...collections.students,
		query: { sort: 'created', filter: `year = "${page.params.year}"`, expand: 'program' }
	}}
/>
