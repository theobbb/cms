<script lang="ts">
	import { collections } from '$config/apps/annuel/collections';

	import DataTable from '$lib/ui/data-table/data-table.svelte';
</script>

<DataTable collection={{ ...collections.project_tags, query: { sort: 'created' } }} />
