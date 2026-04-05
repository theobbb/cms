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

<!-- <div class="mb-8">
	<a href="/public/{page.params.year}/finissant-es" class="mb-4 block hover:underline">
		← Liste de finissant-e-s
	</a>
</div> -->

{#if record?.draft}
	<div class="mb-16 flex flex-col gap-2 text-sm">
		<div class="">
			<div>Brouillon en attente de validation par le comité web.</div>
			{#if record.created}
				{#if record.created != record.updated}
					<div class="mr-4 text-foreground-muted">modifié: {format_date(record.updated)}</div>
				{/if}
				<div class="text-foreground-muted">créé: {format_date(record.created)}</div>
			{/if}
		</div>

		<div>⚠️ Attention !</div>
		<ul class="list-disc pl-4">
			<li>
				Un seul brouillon peut être en attente à la fois. Si tu en soumets un nouveau, celui-ci sera
				écrasé.
			</li>
			<li>
				Ce système n'est pas protégé par mot de passe — n'importe qui ayant accès au lien peut
				modifier ou écraser ton brouillon.
			</li>
			<li>Garde toujours une copie de tes fichiers / textes sur ton propre ordinateur.</li>
		</ul>
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
