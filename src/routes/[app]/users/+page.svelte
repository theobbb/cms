<script lang="ts">
	import type { Collection } from '$config/types';
	import DataTable from '$lib/ui/data-table/data-table.svelte';

	const { data } = $props();
</script>

<div class="flex divide-x">
	<DataTable collection={data.schema_sections[0][0]} />
</div>
