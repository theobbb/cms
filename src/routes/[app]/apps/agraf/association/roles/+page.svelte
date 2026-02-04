<script lang="ts">
	import { collections } from '$config/apps/agraf/collections';

	import DataTable from '$lib/ui/data-table/data-table.svelte';
</script>

<DataTable collection={{ ...collections.posters, query: { sort: 'created' } }} />
