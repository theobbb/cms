<script lang="ts">
	import { page } from '$app/state';
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import type { RecordModel } from 'pocketbase';
	import { process_collection } from '$config/utils';
	import { use_copy } from '$lib/copy/index.js';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import { EditorCollectionList } from '$lib/ui/data-table/collection-list.svelte.js';
	import Date from '$lib/ui/data-table/fields/date.svelte';
	import { confirm } from '$lib/logic/confirm.svelte.js';
	import Label from '$lib/ui/components/form/label.svelte';
	import { FIELD_ICONS } from '$lib/ui/components/field-icons.js';
	import Section from '$lib/components/section.svelte';
	import DropdownMenu from '$lib/ui/components/pop/dropdown-menu/dropdown-menu.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import ConfirmCancel from '../confirm-cancel.svelte';
	import PopConfirmCancel from '../pop-confirm-cancel.svelte';

	const { session }: { session: RecordModel } = $props();

	const copy = use_copy();
	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const dialog_share = new Pop();
	const dialog_rename = new Pop();
	const pop_menu = new Pop();

	const user = $derived(page.data.user);

	async function delete_session(id: string) {
		const confirmed = await confirm('Annuler l’invitation?');
		if (!confirmed) return;
		await pocketbase.collection('sessions').delete(id);
		toaster.push('success', 'Session annulée');
	}

	async function see_invite() {
		dialog_share.show();
	}
</script>

<div class="border px-4 py-3">
	<div class="mb-3 flex items-center gap-3">
		<div class="icon-[ri--key-line] text-2xl text-muted"></div>
		<div>
			{#if session.verified}
				<div class="w-fit bg-green px-2 text-sm text-green-foreground">Actif</div>
			{:else}
				<div class="w-fit bg-blue px-2 text-sm text-blue-foreground">En attente</div>
			{/if}
		</div>
	</div>

	<div class="flex items-center gap-2">
		{session.user_agent}
		{#if session.id == page.data.session?.id}
			<div class="w-fit bg-blue px-1.5 text-xs">vous</div>
		{/if}
	</div>

	<div class="my-6 grid grid-cols-2 gap-3">
		{#each [{ label: 'Dernière connexion', name: 'last_seen' }, { label: 'Créé', name: 'created' }] as { label, name }}
			<div class="space-y-1 text-sm">
				<div class="flex items-center gap-1.5 text-xs text-muted">
					<div class={[FIELD_ICONS.date, 'text-sm']}></div>
					<div>{label}</div>
				</div>
				<Date {name} row={session} />
			</div>
		{/each}
	</div>

	<div class="flex items-center justify-end">
		{#if !session.verified}
			<Button icon="icon-[ri--key-line]" variant="ghost" onclick={see_invite} />
		{/if}
		{#if session.id != page.data.session.id}
			<Button
				icon="icon-[ri--delete-bin-line]"
				variant="ghost"
				tooltip="Révoquer l'accès"
				onclick={() => delete_session(session.id)}
			/>
		{/if}
		<!-- <Button
			icon="icon-[ri--more-fill]"
			onclick={pop_menu.toggle}
			variant="ghost"
			style="anchor-name: --session-controls-{session.id};"
		/>
		<DropdownMenu
			pop={pop_menu}
			options={[
				{
					type: 'button',
					label: session.label ? 'Renommer' : `Définir un nom`,
					action: dialog_rename.show,
					icon: 'icon-[ri--edit-line]'
				},
				{
					type: 'button',
					label: `Révoquer l'accès`,
					action: () => delete_session(session.id),
					icon: 'icon-[ri--delete-bin-line]'
				}
			]}
			anchor="--session-controls-{session.id};"
			bottom="top"
			right="right"
		/> -->
	</div>
	{#if session.origin != page.url.hostname}
		<div>{session.origin}</div>
	{/if}
</div>

{#if dialog_share.open}
	<DialogShareInvite pop={dialog_share} invite={{ type: 'user', record: session }} />
{/if}

<!-- <form class="contents">
	{#if dialog_rename.open}
		<Dialog pop={dialog_rename}>
			<DialogHeader>
				<DialogTitle>
					{#if session.label}
						Renommer une session
					{:else}
						Définir un nom de session
					{/if}
				</DialogTitle>
			</DialogHeader>
			<Input name="label" label="nom" value={session.label} />
			<PopConfirmCancel confirm="Enregistrer" />
		</Dialog>
	{/if}
</form> -->
