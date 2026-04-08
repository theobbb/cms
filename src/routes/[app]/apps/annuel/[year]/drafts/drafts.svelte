<script lang="ts">
	import { page } from '$app/state';
	import Section from '$lib/components/section.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/components/button.svelte';
	import { format_date } from '$lib/utils/format-date';
	import type { RecordModel } from 'pocketbase';
	import { type Snippet } from 'svelte';

	const { collection, children }: { collection: string; children: Snippet<[DraftRecord]> } =
		$props();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	type DraftRecord = RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean };
	let drafts: DraftRecord[] = $state([]);

	const list_options = $derived({
		filter: `year = "${page.params.year}" && draft = true`,
		sort: '-created',
		...(collection == 'projects' ? {} : { expand: 'program' })
	});

	async function fetch_drafts() {
		drafts = await pocketbase.collection(collection).getFullList(list_options);
	}
	$effect(() => {
		fetch_drafts();

		const unsub = pocketbase.collection(collection).subscribe<DraftRecord>(
			'*',
			({ action, record }) => {
				if (action === 'create') {
					drafts = [record, ...drafts];
				}
				if (action === 'update') {
					if (!record.draft) {
						// It was accepted and is no longer a draft. Remove it from the list.
						drafts = drafts.filter((i) => i.id !== record.id);
					} else {
						// It's still a draft, just updated
						drafts = drafts.map((i) => (i.id === record.id ? record : i));
					}
				}
				if (action === 'delete') {
					drafts = drafts.filter((i) => i.id !== record.id);
				}
			},
			list_options
		);

		return () => unsub.then((fn) => fn());
	});

	async function accept_draft(draft: DraftRecord) {
		const toast = toaster.push('info', 'Validation du brouillon en cours...');

		try {
			const res = await fetch(`/${page.params.year}/drafts/accept-draft`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					draft_id: draft.id,
					collection: collection
				})
			});

			if (!res.ok) {
				throw new Error('Erreur réseau');
			}

			const data = await res.json();

			// Optimistically remove the draft from the UI array
			drafts = drafts.filter((i) => i.id !== draft.id);

			toaster.update(toast, 'success', data.message || 'Brouillon accepté.');
		} catch (err) {
			console.error('Failed to accept draft:', err);
			toaster.update(toast, 'error', 'Erreur lors de la validation du brouillon.');
		}
	}
	async function reject_draft(draft: DraftRecord) {
		try {
			await pocketbase.collection(collection).delete(draft.id);
			// It will be removed from the UI automatically by your real-time subscription
			toaster.push('success', 'Brouillon rejeté.');
		} catch (err) {
			toaster.push('error', 'Erreur lors de la suppression.');
		}
	}
	// async function accept_draft(draft: DraftRecord) {
	// 	const body = { ...draft, draft: false, is_latest: true, id: undefined };
	// 	if (draft.draft_of) {
	// 		await pocketbase.collection(collection).update(draft.draft_of, body);
	// 		await pocketbase.collection(collection).delete(draft.id);
	// 	} else {
	// 		// Root doesnt exist yet
	// 		await pocketbase.collection(collection).update(draft.id, body);
	// 		drafts = drafts.filter((i) => i.id !== draft.id);
	// 	}
	// 	toaster.push('success', 'Brouillon accepté.');
	// }
	// async function reject_draft(draft: DraftRecord) {
	// 	await pocketbase.collection(collection).delete(draft.id);
	// 	toaster.push('success', 'Brouillon rejeté.');
	// }
</script>

<Section size="full">
	<div>Brouillons ({drafts.length})</div>
	<div class="flex flex-col items-center gap-8">
		{#each drafts as draft}
			<div class="w-md border px-4 py-3">
				<div class="flex justify-between gap-4">
					<div class="flex shrink-0 gap-1">
						<div>
							<Button
								onclick={() => accept_draft(draft)}
								size="sm"
								variant="action"
								icon="icon-[ri--check-line]"
								tooltip="Accepter"
							></Button>
						</div>
						<div>
							<Button
								onclick={() => reject_draft(draft)}
								size="sm"
								icon="icon-[ri--close-line]"
								tooltip="Rejeter"
							></Button>
						</div>
					</div>

					<div class="text-sm text-foreground-muted">{format_date(draft.created)}</div>
				</div>
				{@render children(draft)}
				<!-- <div class="text-sm text-muted">Prénom</div>
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
				</div> -->
			</div>
		{/each}
	</div>
</Section>
