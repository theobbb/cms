<script lang="ts">
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import type { RecordModel } from 'pocketbase';

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();
	let drafts: RecordModel[] = $state([]);
	let live_records: Record<string, RecordModel | null> = $state({});

	async function fetch_drafts() {
		drafts = await pocketbase
			.collection('drafts')
			.getFullList({ filter: 'collection = "students"' });

		// Fetch live counterparts for diff
		for (const draft of drafts) {
			live_records[draft.id] = await pocketbase
				.collection('students')
				.getOne(draft.id)
				.catch(() => null);
		}
	}

	async function validate(draft: RecordModel) {
		const toast = toaster.push('loading');
		try {
			const is_virgin = !live_records[draft.id];
			if (is_virgin) {
				await pocketbase.collection('students').create({ id: draft.id, ...draft.data });
			} else {
				await pocketbase.collection('students').update(draft.id, draft.data);
			}
			await pocketbase.collection('drafts').delete(draft.id);
			toaster.update(toast, 'success');
		} catch (err) {
			console.error('Validation failed:', err);
			toaster.update(toast, 'error');
		}
	}

	// Diff logic
	type DiffLine = { type: 'added' | 'removed' | 'unchanged'; content: string };

	function compute_diff(live: RecordModel | null, draft_data: Record<string, any>): DiffLine[] {
		const keys = Object.keys(draft_data);

		const old_obj = live ? Object.fromEntries(keys.map((k) => [k, live[k]])) : {};
		const new_obj = Object.fromEntries(keys.map((k) => [k, draft_data[k]]));

		const old_lines = live ? JSON.stringify(old_obj, null, 2).split('\n') : [];
		const new_lines = JSON.stringify(new_obj, null, 2).split('\n');
		const lines: DiffLine[] = [];

		// Simple line-by-line diff using a map of old lines for O(n) lookup
		const old_set = new Map<string, number>();
		for (const line of old_lines) {
			old_set.set(line, (old_set.get(line) ?? 0) + 1);
		}
		const new_set = new Map<string, number>();
		for (const line of new_lines) {
			new_set.set(line, (new_set.get(line) ?? 0) + 1);
		}

		// Removed lines (in old, not in new or fewer occurrences)
		for (const line of old_lines) {
			const old_count = old_set.get(line) ?? 0;
			const new_count = new_set.get(line) ?? 0;
			if (old_count > new_count) {
				lines.push({ type: 'removed', content: line });
				old_set.set(line, old_count - 1);
			} else {
				lines.push({ type: 'unchanged', content: line });
			}
		}

		// Added lines
		for (const line of new_lines) {
			const new_count = new_set.get(line) ?? 0;
			const old_count = old_set.get(line) ?? 0;
			if (new_count > old_count) {
				lines.push({ type: 'added', content: line });
				new_set.set(line, new_count - 1);
			}
		}

		return lines;
	}

	$effect(() => {
		fetch_drafts();
		const unsub = pocketbase.collection('drafts').subscribe(
			'*',
			(event) => {
				if (event.action === 'create') drafts = [event.record, ...drafts];
				if (event.action === 'update')
					drafts = drafts.map((i) => (i.id === event.record.id ? event.record : i));
				if (event.action === 'delete') drafts = drafts.filter((i) => i.id !== event.record.id);
			},
			{ filter: 'collection = "students"' }
		);
		return () => unsub.then((fn) => fn());
	});
</script>

<div class="mx-12 my-12 w-3xl space-y-10">
	{#if drafts.length === 0}
		<p class="text-sm text-gray-400">Aucun brouillon en attente.</p>
	{/if}

	{#each drafts as draft}
		{@const live = live_records[draft.id] ?? null}
		{@const is_virgin = !live}
		{@const diff = compute_diff(live, draft.data)}

		<div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
			<!-- Header -->
			<div class="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
				<div>
					<span class="font-mono text-sm font-semibold">
						{draft.data.first_name}
						{draft.data.last_name}
					</span>
					{#if is_virgin}
						<span class="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Nouveau</span
						>
					{:else}
						<span class="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
							>Modification</span
						>
					{/if}
				</div>
				<Button onclick={() => validate(draft)}>Valider</Button>
			</div>

			<!-- Diff view -->
			<div class="overflow-x-auto bg-white">
				<table class="w-full font-mono text-xs">
					<tbody>
						{#each diff as line}
							<tr
								class={line.type === 'added'
									? 'bg-green-50'
									: line.type === 'removed'
										? 'bg-red-50'
										: ''}
							>
								<td
									class="w-6 border-r px-2 py-0.5 text-center text-gray-400 select-none {line.type ===
									'added'
										? 'bg-green-100 text-green-600'
										: line.type === 'removed'
											? 'bg-red-100 text-red-600'
											: 'bg-gray-50'}"
								>
									{line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ''}
								</td>
								<td
									class="px-4 py-0.5 whitespace-pre {line.type === 'added'
										? 'text-green-800'
										: line.type === 'removed'
											? 'text-red-800'
											: 'text-gray-700'}"
								>
									{line.content}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/each}
</div>
