<script lang="ts">
	import { process_collection } from '$config/utils';
	import SectionTable from '$lib/ui/data-table/section-table.svelte';

	const { data } = $props();

	$inspect(data.collections.tags);
</script>

<SectionTable
	collection={process_collection(data.collections.tags, {
		fields: { overrides: { color: { ...data.collections.tags.field_map.color, type: 'color' } } }
	})}
/>
