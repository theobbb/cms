<script lang="ts">
	import { process_collection } from '$config/utils';
	import SectionTable from '$lib/ui/data-table/section-table.svelte';

	const { data } = $props();
</script>

<SectionTable
	collection={process_collection(data.collections.programs, {
		title: 'Programmes',
		record_title: 'Programme',
		fields: {
			labels: {
				name: 'nom',
				created: 'créé',
				updated: 'modifié'
			}
		}
	})}
	query={{ sort: '-created' }}
/>
