<script lang="ts">
	import type { RecordModel } from 'pocketbase';
	import Drafts from '../drafts.svelte';

	type DraftRecord = RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean };
</script>

<Drafts collection="projects">
	{#snippet children(project: DraftRecord)}
		<div>{project.name}</div>
	{/snippet}
</Drafts>
