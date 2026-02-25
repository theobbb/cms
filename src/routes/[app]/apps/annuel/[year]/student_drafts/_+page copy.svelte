<script lang="ts">
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import type { RecordModel } from 'pocketbase';

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	let drafts: RecordModel[] = $state([]);

	async function fetch_drafts() {
		drafts = await pocketbase
			.collection('drafts')
			.getFullList({ filter: 'collection = "students"' });
	}
	async function validate(draft: RecordModel) {
		const toast = toaster.push('loading');
		try {
			const is_virgin = !(await pocketbase
				.collection('students')
				.getOne(draft.id)
				.catch(() => null));
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
	$inspect(drafts);

	$effect(() => {
		fetch_drafts();

		const unsub = pocketbase.collection('drafts').subscribe(
			'*',
			(event) => {
				if (event.action === 'create') {
					drafts = [event.record, ...drafts];
				}
				if (event.action === 'update') {
					drafts = drafts.map((i) => (i.id === event.record.id ? event.record : i));
				}
				if (event.action === 'delete') {
					drafts = drafts.filter((i) => i.id !== event.record.id);
				}
			},
			{ filter: 'collection = "students"' }
		);

		return () => unsub.then((fn) => fn());
	});
</script>

<div class="mx-12 my-12 w-xl space-y-8">
	{#each drafts as draft}
		<pre class="font-mono">
			{JSON.stringify(draft.data, null, 2)}
		</pre>
		<Button onclick={() => validate(draft)}>Valider</Button>
	{/each}
</div>
