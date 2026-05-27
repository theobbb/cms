<script lang="ts">
	import { page } from '$app/state';
	import { process_collection } from '$config/utils';
	import SectionTable from '$lib/ui/data-table/section-table.svelte';

	const { data } = $props();
</script>

<SectionTable
	collection={process_collection(data.collections.member_entries, {
		title: 'Membres',
		fields: { hidden: 'year,created,updated' }
	})}
	query={{ sort: 'created', filter: `year = "${page.params.year}"` }}
/>
