<script lang="ts">
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import DialogInviteUser from './dialog-invite-user.svelte';

	const { data } = $props();

	let dialog_invite_open = $state(false);
</script>

<DataTable
	no_editor
	collection={data.collections.users}
	query={{ sort: 'created', filter: 'verified=true' }}
>
	<!-- {#snippet header()}
		<Button onclick={() => (dialog_invite_open = true)}>+ New user</Button>
	{/snippet} -->
</DataTable>

{#if dialog_invite_open}
	<DialogInviteUser onclose={() => (dialog_invite_open = false)} />
{/if}
