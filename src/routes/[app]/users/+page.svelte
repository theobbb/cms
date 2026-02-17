<script lang="ts">
	import { page } from '$app/state';
	import { use_editor } from '$lib/logic/editor.svelte';
	import Button from '$lib/ui/button.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import DialogInviteUser from './dialog-invite-user.svelte';

	const { data } = $props();

	const editor = use_editor();

	let dialog_invite_open = $state(false);
</script>

<DataTable
	no_editor
	collection={{ ...data.collections.users, query: { sort: 'created', filter: 'verified=true' } }}
>
	{#snippet header()}
		<Button onclick={() => (dialog_invite_open = true)}>+ New user</Button>
	{/snippet}
</DataTable>

{#if dialog_invite_open}
	<DialogInviteUser onclose={() => (dialog_invite_open = false)} />
{/if}
