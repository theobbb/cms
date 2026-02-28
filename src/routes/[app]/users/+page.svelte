<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import DialogInviteUser from './dialog-invite-user.svelte';

	const { data } = $props();

	let dialog_invite_open = $state(false);
</script>

<div>
	<Button onclick={() => (dialog_invite_open = true)}>+ New user</Button>
</div>
<DataTable
	no_editor
	collection={{
		...data.collections.users,
		fields: data.collections.users.fields.filter((f) => f.name != 'email')
	}}
	query={{ sort: 'created' }}
>
	<!-- {#snippet header()}
		<Button onclick={() => (dialog_invite_open = true)}>+ New user</Button>
	{/snippet} -->
</DataTable>

{#if dialog_invite_open}
	<DialogInviteUser onclose={() => (dialog_invite_open = false)} />
{/if}
