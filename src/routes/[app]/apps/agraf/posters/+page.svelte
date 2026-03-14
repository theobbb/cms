<script lang="ts">
	import { process_collection } from '$config/utils';
	import SectionTable from '$lib/ui/data-table/section-table.svelte';

	const { data } = $props();
</script>

<SectionTable
	collection={process_collection(data.collections.posters, {
		fields: {
			hidden: 'updated,created',
			labels: { title: 'titre', body: 'texte' }
		}
	})}
	query={{ sort: 'date' }}
/>
