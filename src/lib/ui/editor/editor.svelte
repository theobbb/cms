<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import Menu from '$lib/ui/pop/menu.svelte';
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_toaster } from '$lib/logic/toaster.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import { FieldComponents } from './field.components';
	import Button from '../button.svelte';
	import Section from '$lib/components/section.svelte';
	import { use_editor, type EditorTarget } from '$lib/logic/editor.svelte';
	import { use_data_store } from '$lib/logic/data.svelte';

	const { editor }: { editor: EditorTarget } = $props();
	const props_id = $props.id();

	const toaster = use_toaster();
	const pocketbase = use_pocketbase();
	const data_store = use_data_store();

	const method = $derived(editor?.type == 'create' ? 'POST' : 'UPDATE');
	const collection = $derived(editor?.collection);

	const update_record = $derived(editor?.type == 'update' ? editor.record : null);

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		const form_data = new FormData(event.currentTarget, event.submitter);

		let canceled = false;
		function cancel() {
			canceled = true;
		}

		//const callback = await onbeforesubmit(form_data, cancel);

		const field_callbacks = await Promise.all(
			field_on_submit.filter((f) => typeof f === 'function').map((f) => f!(form_data, cancel))
		);
		if (canceled) return;

		let record: any | null;

		if (method == 'POST') {
			const toast_id = toaster.push('loading', 'Création de: ' + collection.title + ' ...');
			try {
				record = await pocketbase.collection(collection.name).create(form_data);
				toaster.update(toast_id, 'success', collection.title + ' créé');
			} catch (err) {
				toaster.update(toast_id, 'error', 'Erreur lors de la création de: ' + collection.title);
				console.log(err);
			}
		} else if (method == 'UPDATE') {
			const toast_id = toaster.push('loading', 'Enregistrement de: ' + collection.title + ' ...');
			if (!update_record?.id) return;
			try {
				record = await pocketbase.collection(collection.name).update(update_record.id, form_data);
				toaster.update(toast_id, 'success', collection.title + ' enregistré');
			} catch (err) {
				console.log(err);
				toaster.update(toast_id, 'error', collection.title + ' erreur');
			}
		}

		exit();
		if (!record) return;
		//if (callback && typeof callback == 'function') callback(record);

		// for (const field_callback of field_callbacks) {
		// 	if (typeof field_callback === 'function') {
		// 		field_callback(record);
		// 	}
		// }
	}

	async function delete_record() {
		if (!update_record?.id) return;
		const confirmed = await confirm(`Veux-tu vraiment supprimer cette sélection? 😓`);
		if (!confirmed) return;

		await pocketbase.collection(collection.name).delete(update_record.id);
		toaster.push('success', collection.title + ' supprimé');
		exit();
	}

	function copy_record_to_clipboard() {
		if (!update_record) return;
		navigator.clipboard.writeText(JSON.stringify(update_record));

		toaster.push('info', 'JSON copié sur le clipboard');
	}

	const editor_ctx = use_editor();

	function exit() {
		//invalidate('data:' + collection);
		const collection = String(editor.collection.name);
		editor_ctx.close();
		data_store.invalidate_collection(collection);
		//invalidateAll();

		//ctx.close_drawer();
	}

	const field_on_submit: Array<(fd: FormData, cancel: () => void) => Promise<void>> = $state([]);
</script>

<form {onsubmit} class="contents">
	<Section size="lg">
		{#snippet header()}
			<div class="pb-gap-y- flex items-center justify-between gap-4">
				<div class="">
					{method == 'POST' ? 'Nouveau' : 'Édition'}: <span class="">{collection.title}</span>
				</div>
				{#if method == 'UPDATE'}
					<Menu
						icon="icon-[ri--more-fill]"
						variant="ghost"
						options={[
							{ title: 'Copier raw JSON', action: copy_record_to_clipboard },
							{
								title: 'Dupliquer',
								action: () => {
									toaster.push('warning', 'Pas encore fait');
								}
							},
							{ title: 'Supprimer', action: () => delete_record() }
						]}
						pop_position="bottom-right"
					></Menu>
				{/if}
			</div>
		{/snippet}

		<div class="flex flex-col gap-gap pt-gap-y pb-12">
			{#each collection.fields as field, i}
				{@const Component = FieldComponents[field.type]}
				{#if Component}
					<Component
						id="{field.key.toString()}-{props_id}"
						value={update_record?.[field.key]}
						record={update_record}
						{...field}
						bind:onsubmit={field_on_submit[i]}
					/>
				{:else}
					type not implemented yet: {field.type}
				{/if}
			{/each}
			<div class="h-gap-y"></div>
		</div>

		{#snippet footer()}
			<div class="flex justify-end gap-1.5">
				<Button size="lg" variant="ghost" onclick={exit}>Annuler</Button>
				<Button size="lg" type="submit" variant="action" autofocus>
					{method == 'POST' ? 'Créer' : 'Enregistrer'}
				</Button>
			</div>
		{/snippet}
	</Section>
</form>
