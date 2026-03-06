<script lang="ts">
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import { FieldComponents } from './field.components';
	import Button from '../components/button.svelte';
	import Section from '$lib/components/section.svelte';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte';
	import { Pop } from '../components/pop/pop-context.svelte';
	import DropdownMenu from '../components/pop/dropdown-menu/dropdown-menu.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte';
	import ConfirmCancel from '../templates/confirm-cancel.svelte';

	const editor = use_editor();
	const { target } = $derived(editor);

	const props_id = $props.id();

	const toaster = use_toaster();
	const pocketbase = use_pocketbase();

	const method = $derived(target?.type == 'create' ? 'POST' : 'UPDATE');
	const collection = $derived(target?.collection);

	const fields = $derived(
		collection?.fields.filter(
			(field) => field.type != 'autodate' && !field.hidden && !field.table_only
		)
	);

	const update_record = $derived(target?.type == 'update' ? target.record : null);

	const form_action = init_form_action();

	const onsubmit = form_action.submit(async ({ form_data }) => {
		if (!collection) return;

		let record: any | null;

		if (method == 'POST') {
			record = await pocketbase.collection(collection.name).create(form_data);
			form_action.toaster.push('success', collection.name + ' créé');
		} else if (method == 'UPDATE') {
			if (!update_record?.id) return;
			record = await pocketbase.collection(collection.name).update(update_record.id, form_data);
			form_action.toaster.push('success', collection.name + ' enregistré');
		}
		editor_ctx.close();
	});

	async function delete_record() {
		if (!collection) return;
		if (!update_record?.id) return;
		const confirmed = await confirm(`Supprimer cette sélection ?`);
		if (!confirmed) return;

		await pocketbase.collection(collection.name).delete(update_record.id);
		toaster.push('success', collection.name + ' supprimé');

		editor_ctx.close();
	}

	function copy_record_to_clipboard() {
		if (!update_record) return;
		navigator.clipboard.writeText(JSON.stringify(update_record));

		toaster.push('info', 'JSON copié sur le clipboard');
	}

	const editor_ctx = use_editor();

	const pop_controls = new Pop();

	// const field_on_submit: Array<(fd: FormData, cancel: () => void) => Promise<void>> = $state([]);
</script>

<form {onsubmit} class="contents">
	<Section size="lg">
		{#snippet header()}
			<div class="flex items-center justify-between gap-4">
				<div class="">
					{method == 'POST' ? 'Nouveau' : 'Édition'}: <span class="">{collection?.name}</span>
				</div>
				{#if method == 'UPDATE'}
					<div>
						<Button
							icon="icon-[ri--more-fill]"
							variant="ghost"
							style="anchor-name: --editor-{props_id}"
							onclick={pop_controls.toggle}
						/>

						<DropdownMenu
							pop={pop_controls}
							anchor="--editor-{props_id}"
							right="end"
							top="bottom"
							class="my-1"
							options={[
								{ label: 'Copier raw JSON', action: copy_record_to_clipboard, type: 'button' },
								{
									label: 'Dupliquer',
									action: () => {
										toaster.push('warning', 'Pas encore fait');
									},
									type: 'button'
								},
								{ type: 'divider' },
								{
									label: 'Supprimer',
									icon: 'icon-[ri--delete-bin-line]',
									class: 'text-red-500',
									action: () => delete_record(),
									type: 'button'
								}
							]}
						/>
					</div>
				{/if}
			</div>
		{/snippet}

		<div class="flex flex-col gap-gap pt-gap-y pb-12">
			{#each fields as field, i}
				{@const Component = FieldComponents[field.type as keyof typeof FieldComponents] ?? null}
				{#if Component}
					<Component
						record={update_record}
						{...field}
						value={update_record?.[field.name]}
						id="{field.name.toString()}-{props_id}"
					/>
				{:else}
					type not implemented yet: {field.type}
				{/if}
			{/each}
			<div class="h-gap-y"></div>
		</div>

		{#each Object.entries(editor.defaults) as [key, val]}
			<input type="hidden" name={key} value={val} />
		{/each}

		{#snippet footer()}
			<div class="flex justify-end gap-1.5">
				<ConfirmCancel
					confirm={method == 'POST' ? 'Créer' : 'Enregistrer'}
					onclose={editor_ctx.close}
				/>
				<!-- <FooterButtons
					onclose={editor_ctx.close}
					action={method == 'POST' ? 'Créer' : 'Enregistrer'}
				/> -->
				<!-- <Button size="lg" variant="ghost" onclick={exit}>Annuler</Button>
				<Button size="lg" type="submit" variant="action" autofocus>
					{method == 'POST' ? 'Créer' : 'Enregistrer'}
				</Button> -->
			</div>
		{/snippet}
	</Section>
</form>
