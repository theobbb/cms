<script lang="ts">
	import Draft from '../draft.svelte';

	const { data } = $props();
	const { collections } = $derived(data);
</script>

<Draft collection={collections.projects} virgin />
