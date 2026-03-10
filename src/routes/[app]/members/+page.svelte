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

	const { data } = $props();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const dialog_new_invite = new Pop();
	const dialog_see_invite = new Pop();

	let invite: RecordModel | null = $state(null);

	// const field_verified = data.collections.users.field_map.verified;
	// if (field_verified) {
	// 	field_verified.type = 'snippet';
	// 	field_verified.snippet = verified;
	// }
	//data.collections.users.field_map.verified.type = 'snippet';

	// const fields = $derived([
	// 	...data.collections.users.fields.filter((f) => f.name != 'email'),
	// 	{ type: 'snippet', snippet: controls }
	// ]);

	async function delete_invite(id: string) {
		await confirm('Annuler l’invitation?');
		await pocketbase.collection('users').delete(id);
		toaster.push('success', 'Invitation annulée');
	}

	async function see_invite(record: RecordModel) {
		invite = record;
		dialog_see_invite.show();
	}
</script>

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
			<div class="bg-blue w-fit px-2 text-sm">En attente</div>
		{/if}
	</div>
{/snippet}

<div class="flex-">
	<div class="mx-auto max-w-5xl">
		<Section size="full">
			{#snippet header()}
				<TableHeader title="Membres">
					<Button onclick={dialog_new_invite.show}>+ Inviter</Button>
				</TableHeader>
			{/snippet}
			<TableCollection
				collection={process_collection(data.collections.users, {
					fields: {
						hidden: 'updated,email,verified',
						labels: {
							created: 'créé'
						},
						snippets: {
							status: { snippet: verified, index: 1 },
							controls: { snippet: controls, index: 6 }
						}
					}
				})}
				query={{ sort: '-created' }}
			/>
		</Section>
	</div>
</div>

{#if dialog_new_invite.open}
	<DialogInviteUser pop={dialog_new_invite} callback={see_invite} />
{/if}
{#if dialog_see_invite.open && invite}
	<DialogShareInvite pop={dialog_see_invite} invite={{ type: 'user', record: invite }} />
{/if}
