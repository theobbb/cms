<script lang="ts">
	import { process_collection } from '$config/utils';
	import SectionTable from '$lib/ui/data-table/section-table.svelte';

	const { data } = $props();
</script>

<SectionTable
	collection={process_collection(data.collections.socials, {
		title: 'Liens',
		record_title: 'Lien',
		fields: {
			hidden: '',
			labels: {
				name: 'nom',
				created: 'créé',
				updated: 'modifié'
			}
		}
	})}
	query={{ sort: 'created' }}
/>
