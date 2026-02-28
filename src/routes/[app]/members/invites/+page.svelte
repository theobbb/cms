<script lang="ts">
	import { page } from '$app/state';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import Button from '$lib/ui/button.svelte';
	import DataTable from '$lib/ui/data-table/data-table.svelte';

	const { data } = $props();

	const toaster = use_toaster();

	let dialog_invite_open = $state(false);

	const fields = $derived([
		{ name: 'link', type: 'snippet', snippet: link },
		...data.collections._user_invites.fields
	]);

	async function copy_link(id: string) {
		const url = page.url.host + '/auth?register=' + id;
		await navigator.clipboard.writeText(url);

		toaster.push('info', url + ' copied to clipboard');
	}
</script>

{#snippet link(item: any)}
	<Button icon="icon-[ri--link]" onclick={() => copy_link(item.id)}></Button>
{/snippet}

<!-- <Button onclick={() => (dialog_invite_open = true)}>Inviter</Button> -->

<DataTable
	no_editor
	collection={{
		...data.collections._user_invites,
		fields
	}}
	query={{ sort: 'created' }}
/>
