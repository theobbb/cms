<script lang="ts">
	import Section from '$lib/components/section.svelte';
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

	type FieldDiff = {
		key: string;
		old_value: any;
		new_value: any;
		status: 'added' | 'modified' | 'unchanged';
	};

	function compute_field_diff(
		live: RecordModel | null,
		draft_data: Record<string, any>
	): FieldDiff[] {
		return Object.keys(draft_data).map((key) => {
			const old_val = live?.[key] ?? undefined;
			const new_val = draft_data[key];
			const old_str = JSON.stringify(old_val);
			const new_str = JSON.stringify(new_val);

			return {
				key,
				old_value: old_val,
				new_value: new_val,
				status: old_val === undefined ? 'added' : old_str !== new_str ? 'modified' : 'unchanged'
			};
		});
	}

	function fmt(val: any): string {
		if (val === undefined || val === null) return '—';
		if (typeof val === 'string') return val;
		return JSON.stringify(val);
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

<Section size="full">
	<div class="mx-auto my-12 max-w-4xl space-y-6">
		{#if drafts.length === 0}
			<p class="text-sm text-gray-400">Aucun brouillon en attente.</p>
		{/if}

		{#each drafts as draft}
			{@const live = live_records[draft.id] ?? null}
			{@const is_virgin = !live}
			{@const fields = compute_field_diff(live, draft.data)}
			{@const changed_fields = fields.filter((f) => f.status !== 'unchanged')}

			<div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
				<!-- Header -->
				<div class="flex items-center justify-between border-b bg-gray-50 px-5 py-4">
					<div class="flex items-center gap-3">
						<div>
							<p class="text-sm font-semibold text-gray-900">
								{draft.data.first_name}
								{draft.data.last_name}
							</p>
							<p class="text-xs text-gray-400">ID: {draft.id}</p>
						</div>
						{#if is_virgin}
							<span
								class="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700"
							>
								✦ Nouveau
							</span>
						{:else}
							<span
								class="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700"
							>
								✎ {changed_fields.length} champ{changed_fields.length > 1 ? 's' : ''} modifié{changed_fields.length >
								1
									? 's'
									: ''}
							</span>
						{/if}
					</div>
					<Button onclick={() => validate(draft)}>Valider</Button>
				</div>

				<!-- Field diff table -->
				<table class="w-full text-sm">
					<thead>
						<tr
							class="border-b bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase"
						>
							<th class="w-1/4 px-5 py-2 text-left">Champ</th>
							{#if !is_virgin}
								<th class="w-[37.5%] px-5 py-2 text-left">Avant</th>
							{/if}
							<th class="px-5 py-2 text-left">Après</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						{#each fields as field}
							{@const is_changed = field.status !== 'unchanged'}
							<tr
								class={is_changed
									? field.status === 'added'
										? 'bg-green-50/60'
										: 'bg-amber-50/60'
									: ''}
							>
								<td class="px-5 py-2.5 font-mono text-xs text-gray-500">{field.key}</td>

								{#if !is_virgin}
									<td
										class="px-5 py-2.5 text-gray-400 {is_changed
											? 'line-through decoration-red-300'
											: ''}"
									>
										{fmt(field.old_value)}
									</td>
								{/if}

								<td
									class="px-5 py-2.5 {is_changed ? 'font-medium text-gray-900' : 'text-gray-600'}"
								>
									{fmt(field.new_value)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/each}
	</div>
</Section>
