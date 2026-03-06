<script lang="ts">
	import { page } from '$app/state';
	import DataTable from '$lib/ui/data-table/section-table.svelte';

	const { data } = $props();
</script>

<DataTable
	collection={data.collections.member_entries}
	query={{ filter: `year = "${page.params.year}"`, sort: 'created' }}
/>
