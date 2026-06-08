<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import Section from '$lib/components/section.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { confirm } from '$lib/logic/confirm.svelte.js';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/components/button.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte.js';
	import type { RecordModel } from 'pocketbase';
	import Dropdown from './dropdown.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import DialogDescription from '$lib/ui/components/pop/dialog/dialog-description.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';
	import PopConfirmCancel from '$lib/ui/templates/pop-confirm-cancel.svelte';
	import { EditorCollectionList } from '$lib/ui/data-table/collection-list.svelte.js';
	import TableHeader from '$lib/ui/data-table/table-header.svelte';
	import Image from '$lib/components/media/image.svelte';

	const { data } = $props();

	const { years } = $derived(data);
	const next_year = $derived(Math.max(...[...years].map((y) => Number(y.id))) + 1);

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const is_admin = $derived(data.user.role <= 0);

	const pop_create = new Pop();

	const list = new EditorCollectionList(data.collections.years, {
		sort: '-id'
	});

	const form_action = init_form_action();

	const onsubmit = form_action.submit(async ({ form_data }) => {
		form_data.set('draft', 'true');
		await pocketbase.collection('years').create(form_data);

		toaster.push('success', 'Année créée');

		pop_create.close();
		await invalidateAll();
	});

	async function toggle_draft(year: RecordModel) {
		const is_draft = Boolean(year.draft);
		const confirmed = await confirm(
			is_draft
				? `Publier ${year.id} ? Le contenu deviendra public.`
				: `Masquer ${year.id} ? Le contenu ne sera plus visible.`,
			'action'
		);
		if (!confirmed) return;

		try {
			pocketbase.collection('years').update(year.id, { draft: !is_draft });
			toaster.push('success', is_draft ? `${year.id} publié.` : `${year.id} masqué.`);
			await invalidateAll();
		} catch (err) {
			toaster.push('error');
		}
	}
</script>

<div class="mx-auto w-full max-w-4xl">
	<Section spacing_x={6}>
		<TableHeader title="Années">
			{#snippet action_bar()}
				{#if is_admin}
					<div>
						<Button onclick={pop_create.show} variant="action" size="lg">+ Ajouter</Button>
					</div>
				{/if}
			{/snippet}
		</TableHeader>

		<div class="mt-8 grid grid-cols-3 gap-8">
			{#each list.items as year}
				<div class="group relative border">
					<a href="/{year.id}" class="peer absolute inset-0" aria-label={year.id}> </a>
					<div class="h-full px-4 py-3 peer-hover:bg-hover">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div class="icon-[ri--link]"></div>
								<div class="text-lg group-hover:underline">{year.id}</div>
							</div>

							<div class="flex items-center gap-1">
								<Button
									onclick={() => toggle_draft(year)}
									variant="none"
									class="text-xl!"
									icon={year.draft ? 'icon-[ri--toggle-line]' : 'icon-[ri--toggle-fill]'}
									tooltip={year.draft ? `Publier ${year.id}` : `Masquer ${year.id}`}
								/>
								<div>
									<Dropdown {year} />
								</div>
							</div>
						</div>
						<div class="mt-6">
							<Image
								class="bg-white"
								collection="years"
								record_id={year.id}
								filename={year.poster}
							/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</Section>
</div>
{#if pop_create.open}
	<Dialog pop={pop_create}>
		<form {onsubmit} class="contents">
			<DialogHeader>
				<DialogTitle>Initialiser une nouvelle année</DialogTitle>
				<DialogDescription>Le contenu ne sera pas encore visible par le public.</DialogDescription>
			</DialogHeader>

			<Input name="id" label="année" required min={4} max={4} value={next_year} />
			<PopConfirmCancel confirm="Créer" />
		</form>
	</Dialog>
{/if}
