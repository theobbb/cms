<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte.js';
	import DialogInviteUser from './dialog-invite-user.svelte';

	const { data } = $props();

	const dialog_invite = new Pop();

	$inspect(dialog_invite);

	const fields = $derived(data.collections.users.fields.filter((f) => f.name != 'email'));
</script>

<!-- <div>
	<Button onclick={dialog_invite.show}>+ New user</Button>
</div> -->
<div class="flex-">
	<div class="border- max-w-4xl">
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
