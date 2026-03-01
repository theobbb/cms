<script lang="ts">
	import DialogInvitation from '$lib/components/auth/dialog-share-invite.svelte';
	import Button from '$lib/ui/button.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte.js';
	import type { RecordModel } from 'pocketbase';
	import DialogInviteUser from './dialog-invite-user.svelte';
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_pocketbase } from '$lib/pocketbase.js';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';

	const { data } = $props();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const dialog_new_invite = new Pop();
	const dialog_see_invite = new Pop();

	let invite: RecordModel | null = $state(null);

	const fields = $derived([
		...data.collections.users.fields.filter((f) => f.name != 'email'),
		{ type: 'snippet', snippet: controls }
	]);

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
			<Button
				icon="icon-[ri--delete-bin-line]"
				variant="ghost"
				onclick={() => delete_invite(row.id)}
			></Button>
			<Button icon="icon-[ri--share-box-line]" variant="ghost" onclick={() => see_invite(row)} />
		{/if}
	</div>
{/snippet}

<div class="flex-">
	<div class="mx-auto max-w-5xl">
		<DataTable
			editor_mode={false}
			collection={{
				...data.collections.users,
				fields
			}}
			query={{ sort: '-created' }}
		>
			{#snippet action()}
				<Button onclick={dialog_new_invite.show}>+ Inviter</Button>
			{/snippet}
		</DataTable>
	</div>
</div>

{#if dialog_new_invite.open}
	<DialogInviteUser pop={dialog_new_invite} callback={see_invite} />
{/if}
{#if dialog_see_invite.open && invite}
	<DialogShareInvite pop={dialog_see_invite} invite={{ type: 'user', record: invite }} />
{/if}
