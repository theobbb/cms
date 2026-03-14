<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import { format_date } from '$lib/utils/format-date';
	import type { RecordModel } from 'pocketbase';
	import type { Snippet } from 'svelte';

	const {
		record,
		has_changed,
		children
	}: { record?: RecordModel | null; has_changed: boolean; children?: Snippet } = $props();

	const is_draft_mode = $derived(!!record?.id);
</script>

<div class="mb-8">
	<a href="/public/{page.params.year}/finissant-e-s" class="mb-4 block hover:underline">
		← Liste de finissant-e-s
	</a>
</div>

{#if record}
	<div class="mb-16 flex flex-col gap-2 text-sm">
		<div class="flex items-center gap-2">
			<Box color="green">
				<div class="px-2 py-0.5">En attente d'approbation</div>
			</Box>

			{#if record.created}
				{#if record.created != record.updated}
					<div class="mr-4 text-foreground-muted">modifié: {format_date(record.updated)}</div>
				{/if}
				<div class="text-foreground-muted">créé: {format_date(record.created)}</div>
			{/if}
		</div>
		<div>
			version {record.draft_version}
		</div>
		<!-- <Box color="yellow">
			<div class="px-2 py-1">
				<strong>Attention:</strong> Seulement un brouillon peut être en attente à la fois. Si tu soumets
				une nouvelle version, la précédente sera écrasée.
			</div>
		</Box> -->
		<!-- <div class="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
			
		</div> -->
	</div>
{/if}

<div
	class="gap-x-gap py-gap-y sticky top-0 z-10 mb-12 flex items-center justify-between border-b bg-background"
>
	<div class="text-xl">
		{#if !record}
			Brouillon
		{:else}
			{@render children?.()}
		{/if}
	</div>
	<div class="flex items-center gap-2">
		<Button size="lg" disabled={!has_changed} variant="action" type="submit">Enregistrer</Button>
	</div>
</div>
