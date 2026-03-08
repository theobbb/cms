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
	import ConfirmCancel from '$lib/ui/templates/confirm-cancel.svelte';
	import type { RecordModel } from 'pocketbase';
	import Dropdown from './dropdown.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import DialogDescription from '$lib/ui/components/pop/dialog/dialog-description.svelte';

	const { data } = $props();

	const { years } = $derived(data);
	const next_year = $derived(Math.max(...[...years].map((y) => Number(y.id))) + 1);

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const is_admin = $derived(data.user.role == 0);

	const pop_create = new Pop();

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		const form_data = new FormData(event.currentTarget, event.submitter);
		try {
			form_data.set('draft', 'true');
			await pocketbase.collection('years').create(form_data);

			toaster.push('success', 'Année créée');

			pop_create.close();
			await invalidateAll();
		} catch (err) {
			toaster.push('error');
			console.error('Invitation failed:', err);
		}
	}

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

<Section size="full">
	<div class="mx-auto max-w-3xs">
		{#if is_admin}
			<div>
				<Button onclick={pop_create.show}>+ Nouveau</Button>
			</div>
		{/if}
		<div class="mt-8">
			{#each years as year}
				<div class="min-h-24- justify-between- flex items-center justify-between">
					<a href="/{year.id}/years" class={['px-2', year.id == page.params.year && 'bg-accent']}>
						{year.id}
					</a>
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
			{/each}
		</div>
	</div>
</Section>

{#if pop_create.open}
	<Dialog pop={pop_create}>
		<form {onsubmit} class="contents">
			<DialogHeader>
				<DialogTitle>Initialiser une nouvelle année</DialogTitle>
				<DialogDescription>Le contenu ne sera pas encore visible par le public.</DialogDescription>
			</DialogHeader>

			<Input name="id" label="année" required min={4} max={4} value={next_year} />
			<ConfirmCancel confirm="Créer" />
		</form>
	</Dialog>
{/if}
