<script lang="ts" generics="Record">
	import { invalidate } from '$app/navigation';
	import { pocketbase } from '$lib/pocketbase';
	import Button from '../../button.svelte';
	import type { DrawerCtx } from '$lib/types';
	import { push_toast, update_toast } from '$lib/logic/toaster.svelte';

	import Menu from '$lib/ui/pop/menu.svelte';
	import { confirm } from '$lib/logic/confirm.svelte';
	import type { CollectionRecords } from '$lib/pocketbase.types';
	import type { Field } from './field.types';
	import { FieldComponents } from './field.components';
	import type { Snippet } from 'svelte';

	const {
		fields,
		title,
		collection,
		ctx,
		controls,
		onsubmit: onbeforesubmit = async () => {
			return () => {};
		}
	}: {
		fields: Field<Record>[];
		title: string;
		collection: keyof CollectionRecords;
		ctx: DrawerCtx<Record>;
		controls?: Snippet;
		onsubmit?: (
			form_data: FormData,
			cancel: () => void
		) => ((record: Record) => void) | Promise<((record: Record) => void) | undefined> | undefined;
	} = $props();

	const method = $derived(ctx.type == 'create' ? 'POST' : 'UPDATE');
	const form_id = $props.id();

	const target_id = $derived((ctx.target as { id: string } | null)?.id);

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		const form_data = new FormData(event.currentTarget, event.submitter);

		let canceled = false;
		function cancel() {
			canceled = true;
		}

		const callback = await onbeforesubmit(form_data, cancel);

		const field_callbacks = await Promise.all(
			field_on_submit.filter((f) => typeof f === 'function').map((f) => f!(form_data, cancel))
		);
		if (canceled) return;

		let record: any | null;

		if (method == 'POST') {
			const toast_id = push_toast('loading', 'Création de: ' + title + ' ...');
			try {
				record = await pocketbase.collection(collection).create(form_data);
				update_toast(toast_id, 'success', title + ' créé');
			} catch (err) {
				update_toast(toast_id, 'error', 'Erreur lors de la création de: ' + title);
				console.log(err);
			}
		} else if (method == 'UPDATE') {
			const toast_id = push_toast('loading', 'Enregistrement de: ' + title + ' ...');
			if (!target_id) return;
			try {
				record = await pocketbase.collection(collection).update(target_id, form_data);
				update_toast(toast_id, 'success', title + ' enregistré');
			} catch (err) {
				console.log(err);
				update_toast(toast_id, 'error', title + ' erreur');
			}
		}

		exit();
		if (!record) return;
		if (callback && typeof callback == 'function') callback(record);

		for (const field_callback of field_callbacks) {
			if (typeof field_callback === 'function') {
				field_callback(record);
			}
		}
	}

	async function delete_record() {
		if (!target_id) return;
		const confirmed = await confirm(`Veux-tu vraiment supprimer cette sélection? 😓`);
		if (!confirmed) return;

		await pocketbase.collection(collection).delete(target_id);
		push_toast('success', title + ' supprimé');
		exit();
	}

	function copy_record_to_clipboard() {
		if (!ctx.target) return;
		navigator.clipboard.writeText(JSON.stringify(ctx.target));

		push_toast('info', 'JSON copié sur le clipboard');
	}

	function exit() {
		invalidate('data:' + collection);
		ctx.close_drawer();
	}

	const field_on_submit: Array<(fd: FormData, cancel: () => void) => Promise<void>> = $state([]);
</script>

<div class="w-drawer flex h-full flex-col">
	<form
		{onsubmit}
		class="max-w-drawer pointer-events-auto grid h-screen grid-rows-[auto_1fr_auto] border-l bg-bg pt-gap-y pr-gap"
	>
		<div class="flex items-center justify-between gap-4 pb-gap-y">
			<div class="pl-gap text-lg">
				{method == 'POST' ? 'Nouveau' : 'Édition'}: <span class="">{title}</span>
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
								push_toast('warning', 'Pas encore fait');
							}
						},
						{ title: 'Supprimer', action: () => delete_record() }
					]}
					pop_position="bottom-right"
				></Menu>
			{/if}
		</div>

		<div class="overflow-x-visible- relative -mr-gap h-full overflow-y-auto">
			<div class="absolute inset-0 flex flex-col gap-gap px-gap pt-gap-y pb-12">
				{#each fields as field, i}
					{@const Component = FieldComponents[field.type]}
					{#if Component}
						<Component
							id="{field.name.toString()}-{form_id}"
							value={ctx.target?.[field.name]}
							{...field}
							bind:onsubmit={field_on_submit[i]}
						/>
					{:else}
						type not implemented yet: {field.type}
					{/if}
				{/each}
				<div class="h-gap-y"></div>
			</div>
		</div>

		<div class="mb-gap-y ml-gap flex justify-end gap-1.5 border-t py-gap-y">
			<Button size="lg" variant="ghost" onclick={ctx.close_drawer}>Annuler</Button>
			<Button size="lg" type="submit" variant="action" autofocus>
				{method == 'POST' ? 'Créer' : 'Enregistrer'}
			</Button>
		</div>
	</form>
</div>
