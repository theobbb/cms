<script lang="ts">
	import { page } from '$app/state';
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import type { RecordModel } from 'pocketbase';
	import DialogNewSession from './dialog-new-session.svelte';
	import TableHeader from '$lib/ui/data-table/table-header.svelte';
	import { process_collection } from '$config/utils';
	import { use_copy } from '$lib/copy/index.js';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import { EditorCollectionList } from '$lib/ui/data-table/collection-list.svelte.js';
	import Date from '$lib/ui/data-table/fields/date.svelte';
	import { confirm } from '$lib/logic/confirm.svelte.js';
	import Label from '$lib/ui/components/form/label.svelte';
	import { FIELD_ICONS } from '$lib/ui/components/field-icons.js';
	import Section from '$lib/components/section.svelte';
	import CardSession from '$lib/ui/templates/auth/card-session.svelte';

	const { data } = $props();

	const copy = use_copy();
	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const dialog_new_session = new Pop();
	const dialog_see_session = new Pop<RecordModel>();

	const user = $derived(page.data.user);

	const list = new EditorCollectionList(data.collections.sessions, {
		filter: `user = "${user.id}"`,
		sort: '-created'
	});

	async function delete_session(id: string) {
		const confirmed = await confirm('Annuler l’invitation?');
		if (!confirmed) return;
		await pocketbase.collection('sessions').delete(id);
		toaster.push('success', 'Session annulée');
	}

	async function see_invite(record: RecordModel) {
		dialog_see_session.show(record);
	}
</script>

<Section spacing_x={6}>
	<TableHeader title="Sessions">
		{#snippet action_bar()}
			<Button onclick={dialog_new_session.show} variant="action" size="lg">+ Ajouter</Button>
		{/snippet}
	</TableHeader>

	<div class="grid grid-cols-3 gap-12">
		{#each list.items as session}
			<CardSession {session} />
		{/each}
	</div>
</Section>
{#if dialog_new_session.open}
	<DialogNewSession pop={dialog_new_session} />
{/if}
