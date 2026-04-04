<script lang="ts">
	import type { RecordModel } from 'pocketbase';
	import Drafts from '../drafts.svelte';

	type DraftRecord = RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean };
</script>

<Drafts collection="students">
	{#snippet children(draft: DraftRecord)}
		<div class="text-sm text-muted">Prénom</div>
		<div>{draft.first_name}</div>
		<div>Nom</div>
		<div>{draft.last_name}</div>
		<div>{draft.description}</div>
		<div>{draft.pronouns}</div>

		<div>{draft.expand?.program?.name}</div>
		<div>
			{#each draft.socials as social}
				<div class="">
					<div>{social.name}</div>
					<a href={social.url} target="_blank">{social.url}</a>
				</div>
			{/each}
		</div>
	{/snippet}
</Drafts>
