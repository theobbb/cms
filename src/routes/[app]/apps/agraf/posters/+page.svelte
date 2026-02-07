<script lang="ts">
	import DataTable from '$lib/ui/data-table/data-table.svelte';

	const { data } = $props();
</script>

<DataTable collection={{ ...data.collections.posters, query: { sort: 'date' } }} />
