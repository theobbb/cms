<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import Info from '$lib/ui/templates/flags/info.svelte';
	import { format_date } from '$lib/utils/format-date';
	import type { RecordModel } from 'pocketbase';
	import type { Snippet } from 'svelte';

	const {
		record,
		has_changed,
		children
	}: { record?: RecordModel | null; has_changed: boolean; children?: Snippet } = $props();

	const is_draft_mode = $derived(!!record?.id);

	const collection = $derived(page.url.pathname.split('/')[3]);
</script>

<!-- <div class="mb-8">
	<a href="/public/{page.params.year}/finissant-es" class="mb-4 block hover:underline">
		← Liste de finissant-e-s
	</a>
</div> -->

{#if record?.draft}
	<div class="mb-16 flex flex-col gap-2 text-sm">
		<div class="mb-4">
			<div>Brouillon en attente de validation par le comité web.</div>
			{#if record.created}
				{#if record.created != record.updated}
					<div class="mr-4 text-foreground-muted">modifié: {format_date(record.updated)}</div>
				{/if}
				<div class="text-foreground-muted">créé: {format_date(record.created)}</div>
			{/if}
		</div>
		<div class="mb-4">
			<a
				class="text-link"
				href="https://annuel.3xw.ca/{page.params.year}/{collection}/{record.id}"
				target="_blank"
			>
				Voir le brouillon →
			</a>
		</div>
		<Info>
			<ul class="list-disc pl-4">
				<li>
					Un seul brouillon peut être en attente à la fois. Si tu en soumets un nouveau, celui-ci
					sera écrasé.
				</li>
				<li>
					Ce système n'est pas protégé par mot de passe — n'importe qui ayant accès au lien peut
					modifier ou écraser ton brouillon.
				</li>
				<li>Garde toujours une copie de tes fichiers / textes sur ton propre ordinateur.</li>
			</ul>
		</Info>
	</div>
{:else}
	<a
		class="mb-4 block text-link"
		href="https://annuel.3xw.ca/{page.params.year}/{collection}/{record.id}"
		target="_blank"
	>
		Page publique →
	</a>
{/if}

<div
	class="sticky top-0 z-10 mb-12 flex items-center justify-between gap-x-4 border-b bg-background py-2"
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
