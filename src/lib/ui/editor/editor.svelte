<script module>
	export type EditorFormActionContext = FormActionContext & {
		method: 'create' | 'update';
		record?: RecordModel;
	};
</script>

<script lang="ts">
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import { FieldComponents } from './field.components';
	import Button from '../components/button.svelte';
	import Section from '$lib/components/section.svelte';

	import { Pop } from '../components/pop/pop-context.svelte';
	import DropdownMenu from '../components/pop/dropdown-menu/dropdown-menu.svelte';
	import { init_form_action, type FormActionContext } from '$lib/logic/form-action.svelte';
	import ConfirmCancel from '../templates/confirm-cancel.svelte';
	import { use_editor, type Editor } from './editor-context.svelte';
	import type { RecordModel } from 'pocketbase';

	const {
		onsubmit: outer_onsubmit
	}: { onsubmit?: (ctx: EditorFormActionContext) => Promise<void | boolean> } = $props();

	const editor = use_editor();

	const { current } = $derived(editor);

	const props_id = $props.id();

	const toaster = use_toaster();
	const pocketbase = use_pocketbase();

	const method = $derived(current?.method);
	const collection = $derived(editor?.collection);
	const record_title = $derived(collection.record_title || collection.name);

	const fields = $derived(
		collection?.fields.filter(
			(field) =>
				field.type != 'autodate' && !field.hidden && !(field.snippet && field.display == 'table')
		)
	);

	const update_record = $derived(current?.method == 'update' ? current.record : null);

	const form_action = init_form_action();

	const onsubmit = form_action.submit(async (ctx) => {
		if (!collection || !method) return;

		const { form_data } = ctx;

		if (outer_onsubmit)
			await outer_onsubmit({
				...ctx,
				method,
				record: editor.current?.method === 'update' ? editor.current.record : undefined
			});

		if (method == 'create') {
			await pocketbase.collection(collection.name).create(form_data);
			form_action.toaster.push('success', record_title + ' créé');
		} else if (method == 'update') {
			if (!update_record?.id) return;
			await pocketbase.collection(collection.name).update(update_record.id, form_data);
			form_action.toaster.push('success', record_title + ' enregistré');
		}
		editor.close();
	});

	async function delete_record() {
		if (!collection) return;
		if (!update_record?.id) return;
		const confirmed = await confirm(`Supprimer cette sélection ?`);
		if (!confirmed) return;

		await pocketbase.collection(collection.name).delete(update_record.id);
		toaster.push('success', collection.name + ' supprimé');

		editor.close();
	}

	function copy_record_to_clipboard() {
		if (!update_record) return;
		navigator.clipboard.writeText(JSON.stringify(update_record));

		toaster.push('info', 'JSON copié sur le clipboard');
	}

	const pop_controls = new Pop();
</script>

<form {onsubmit} class="contents">
	<Section size="lg">
		{#snippet header()}
			<div class="flex items-center justify-between gap-4">
				<div class="">
					{method == 'create' ? 'Nouveau' : 'Édition'}:
					<span class="">{collection?.record_title || collection?.name}</span>
				</div>
				{#if method == 'update'}
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

		<div class="flex flex-col gap-3x pt-1x pb-12">
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
					type not implemented yet: {field.type} - for {field.name}
				{/if}
			{/each}
			<div class="h-3x"></div>
		</div>

		{#snippet footer()}
			<ConfirmCancel
				confirm={method == 'create' ? 'Créer' : 'Enregistrer'}
				onclose={editor.close}
			/>
		{/snippet}
	</Section>
</form>
