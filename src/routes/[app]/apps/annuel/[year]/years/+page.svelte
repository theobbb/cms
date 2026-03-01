<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import Section from '$lib/components/section.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { confirm } from '$lib/logic/confirm.svelte.js';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import Bool from '$lib/ui/editor/fields/bool.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';
	import FooterButtons from '$lib/ui/templates/footer-buttons.svelte';
	import type { RecordModel } from 'pocketbase';

	const { data } = $props();

	const { years } = $derived(data);
	const next_year = $derived(Math.max(...[...years].map((y) => Number(y.id))) + 1);

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

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

	async function ontoggle_draft(value: boolean, year: RecordModel) {
		const confirmed = await confirm(value ? 'Publier?' : 'Brouillon', 'action');

		if (!confirmed) return;
		try {
			await pocketbase.collection('years').update(year.id, { draft: value });

			toaster.push('success');

			await invalidateAll();
		} catch (err) {
			toaster.push('error');
			console.error('Invitation failed:', err);
		}
	}
</script>

<Section>
	<div>
		<Button onclick={pop_create.show}>Nouveau</Button>
	</div>
	<div class="">
		{#each years as year}
			<div class="min-h-24">
				<div>{year.id}</div>
				<a class={[year.id == page.params.year ? 'bg-accent' : '']} href="/{year.id}/years"
					>{year.id}</a
				>
				<div>
					<Button onclick={() => ontoggle_draft(!year.draft, year)} variant="none">
						<span
							class={['text-3xl', year.draft ? 'icon-[ri--toggle-fill]' : 'icon-[ri--toggle-line]']}
						></span>
					</Button>
				</div>
			</div>
		{/each}
	</div>
</Section>

{#if pop_create.open}
	<Dialog pop={pop_create}>
		<div>Initialiser une nouvelle année</div>
		<div>Elle sera en status brouillon et ne sera pas encore visible par le public.</div>
		<form {onsubmit}>
			<Input name="id" label="année" required min={4} max={4} value={next_year} />
			<FooterButtons pop={pop_create} action="Créer" />
		</form>
	</Dialog>
{/if}
