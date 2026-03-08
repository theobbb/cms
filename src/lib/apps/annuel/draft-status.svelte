<script lang="ts">
	import Box from '$lib/components/box.svelte';

	const { record } = $props();
</script>

<div>
	{#if record.draft}
		<Box color={record.draft_of ? 'green' : 'blue'}>
			<div class="px-1 text-xs">
				{record.draft_of ? 'Nouveau' : `En attente d'approbation`}
			</div>
		</Box>
	{/if}
</div>
