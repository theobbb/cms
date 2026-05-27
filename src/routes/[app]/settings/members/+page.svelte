<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte.js';
	import type { RecordModel } from 'pocketbase';
	import DialogInviteUser from './dialog-invite-user.svelte';
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_pocketbase } from '$lib/pocketbase.js';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import Controls from './controls.svelte';
	import TableCollection from '$lib/ui/data-table/table-collection.svelte';
	import TableHeader from '$lib/ui/data-table/table-header.svelte';
	import Section from '$lib/components/section.svelte';
	import { process_collection } from '$config/utils';
	import { use_copy } from '$lib/copy/index.js';
	import SelectRole from './select-role.svelte';

	const { data } = $props();

	const copy = use_copy();
	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const dialog_new_invite = new Pop();
	const dialog_see_invite = new Pop();

	let invite: RecordModel | null = $state(null);

	async function delete_invite(id: string) {
		const confirmed = await confirm('Annuler l’invitation?');
		if (!confirmed) return;
		await pocketbase.collection('users').delete(id);
		toaster.push('success', 'Invitation annulée');
	}

	async function see_invite(record: RecordModel) {
		invite = record;
		dialog_see_invite.show();
	}
</script>

<div class="flex-">
	<div class="mx-auto max-w-5xl">
		<Section size="full">
			{#snippet header()}
				<TableHeader title="Membres">
					{#snippet action_bar()}
						<Button onclick={dialog_new_invite.show} variant="action" size="lg">
							+ {copy.members.invite_new_member_button}
						</Button>
					{/snippet}
				</TableHeader>
			{/snippet}
			<TableCollection
				collection={process_collection(data.collections.users, {
					fields: {
						hidden: 'updated,email,verified,created',
						labels: {
							name: 'nom'
						},
						snippets: {
							name: { snippet: name },
							status: { snippet: verified, index: 1 },
							controls: { snippet: controls, index: 6 },
							role: { snippet: role }
						}
					}
				})}
				query={{ sort: '-created' }}
			/>
		</Section>
	</div>
</div>

{#snippet name(row: RecordModel)}
	<div class="flex items-center gap-2">
		{row.name}
		{#if row.id == data.user?.id}
			<div class="w-fit bg-blue px-1.5 text-xs">vous</div>
		{/if}
	</div>
{/snippet}

{#snippet controls(row: RecordModel)}
	<div class="flex items-center justify-end">
		{#if !row.verified}
			<Button icon="icon-[ri--key-line]" variant="ghost" onclick={() => see_invite(row)} />
			<Button
				icon="icon-[ri--delete-bin-line]"
				variant="ghost"
				onclick={() => delete_invite(row.id)}
			/>
		{:else}
			<Controls user={row} />
		{/if}
	</div>
{/snippet}

{#snippet verified(row: RecordModel)}
	<div>
		{#if !row.verified}
			<div class="w-fit bg-blue px-2 text-sm">En attente</div>
		{/if}
	</div>
{/snippet}

{#snippet role(row: RecordModel)}
	<div>
		<SelectRole user={row} />
	</div>
{/snippet}

{#if dialog_new_invite.open}
	<DialogInviteUser pop={dialog_new_invite} callback={see_invite} />
{/if}
{#if dialog_see_invite.open && invite}
	<DialogShareInvite pop={dialog_see_invite} invite={{ type: 'user', record: invite }} />
{/if}
