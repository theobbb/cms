<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/button.svelte';
	import { format_date } from '$lib/utils/format-date';

	let { draft, has_changed, is_virgin_record, children } = $props();

	const is_draft_mode = $derived(!!draft?.id);
</script>

<div class="mb-8">
	<a href="/public/{page.params.year}/finissant-e-s" class="mb-4 block hover:underline">
		← Liste de finissant-e-s
	</a>
</div>

{#if is_draft_mode}
	<div class="mb-16 flex flex-col gap-2 text-sm">
		<div class="flex items-center gap-2">
			<Box color="green">
				<div class="px-2 py-0.5">En attente d'approbation</div>
			</Box>

			{#if draft.created}
				{#if draft.created != draft.updated}
					<div class="text-muted mr-4">modifié: {format_date(draft.updated)}</div>
				{/if}
				<div class="text-muted">créé: {format_date(draft.created)}</div>
			{/if}
		</div>
		<Box color="yellow">
			<div class="px-2 py-1">
				<strong>Attention:</strong> Seulement un brouillon peut être en attente à la fois. Si tu soumets
				une nouvelle version, la précédente sera écrasée.
			</div>
		</Box>
		<!-- <div class="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
			
		</div> -->
	</div>
{/if}

<div
	class="bg-background sticky top-0 z-10 mb-12 flex items-center justify-between gap-x-gap border-b py-gap-y"
>
	<div class="text-xl">
		{#if is_virgin_record}
			Brouillon
		{:else}
			{@render children?.()}
		{/if}
	</div>
	<div class="flex items-center gap-2">
		<Button disabled={!has_changed} variant="action" type="submit">Publier</Button>
	</div>
</div>
