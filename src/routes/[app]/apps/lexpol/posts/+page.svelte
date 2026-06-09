<script lang="ts">
	import { process_collection } from '$config/utils.js';
	import DataTable from '$lib/ui/data-table/section-table.svelte';

	const { data } = $props();
</script>

<DataTable
	collection={process_collection(data.collections.posts, {
		fields: {
			labels: { title: 'titre', members: 'membres' },
			overrides: { about: { type: 'markdown' }, body: { type: 'markdown' } }
		}
	})}
/>
