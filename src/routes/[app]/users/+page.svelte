<script lang="ts">
	import { page } from '$app/state';
	import { use_editor } from '$lib/logic/editor.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import DialogInviteUser from './dialog-invite-user.svelte';

	const { data } = $props();

	const editor = use_editor();

	$inspect(editor.current);
</script>

<div class="flex divide-x">
	<DataTable collection={data.collections.users} />
</div>

{#if editor.current && page.url.searchParams.has('editor')}
	<DialogInviteUser onclose={editor.close} />
{/if}
