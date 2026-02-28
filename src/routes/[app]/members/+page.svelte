<script lang="ts">
	import DialogInvitation from '$lib/components/auth/dialog-invite.svelte';
	import Button from '$lib/ui/button.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte.js';
	import DialogInviteUser from './dialog-invite-user.svelte';

	const { data } = $props();

	const dialog_invite = new Pop();

	const fields = $derived(data.collections.users.fields.filter((f) => f.name != 'email'));
</script>

<div class="flex-">
	<div class="border- mx-auto max-w-5xl">
		<DataTable
			editor_mode={false}
			collection={{
				...data.collections.users,
				fields
			}}
			query={{ sort: 'created' }}
		>
			{#snippet action()}
				<Button onclick={dialog_invite.show}>+ New user</Button>
			{/snippet}
		</DataTable>
	</div>
</div>

{#if dialog_invite.open}
	<DialogInviteUser pop={dialog_invite} />
{/if}
