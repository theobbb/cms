<script>
	import SectionTable from '$lib/ui/data-table/section-table.svelte';

	const { data } = $props();
</script>

<SectionTable collection={data.collections.bookmarks} />
