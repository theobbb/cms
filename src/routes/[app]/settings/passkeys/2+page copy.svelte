<script lang="ts">
	import { page } from '$app/state';
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import { onMount } from 'svelte';
	import type { RecordModel } from 'pocketbase';
	import Info from '$lib/ui/templates/flags/info.svelte';
	import PasskeyInfo from '$lib/ui/templates/passkey-info.svelte';
	import DialogNewSession from './dialog-new-session.svelte';
	import Section from '$lib/components/section.svelte';
	import TableHeader from '$lib/ui/data-table/table-header.svelte';
	import TableCollection from '$lib/ui/data-table/table-collection.svelte';
	import { process_collection } from '$config/utils';
	import { use_copy } from '$lib/copy/index.js';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';

	const { data } = $props();

	const copy = use_copy();
	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const dialog_new_session = new Pop();
	const dialog_see_session = new Pop<RecordModel>();

	let sessions: RecordModel[] = $state([]);

	const user = $derived(page.data.user);

	async function fetch_sessions() {
		sessions = await pocketbase
			.collection('sessions')
			.getFullList({ filter: `user = "${user.id}"` });
	}
	// $inspect(page.data);

	// onMount(() => {
	// 	fetch_sessions();
	// });

	async function delete_session(id: string) {
		const confirmed = await confirm('Annuler l’invitation?');
		if (!confirmed) return;
		await pocketbase.collection('users').delete(id);
		toaster.push('success', 'Invitation annulée');
	}

	async function see_invite(record: RecordModel) {
		dialog_see_session.show(record);
	}
</script>

<Section spacing_x={6}>
	{#snippet header()}
		<TableHeader title="Sessions">
			{#snippet action_bar()}
				<Button onclick={dialog_new_session.show} variant="action" size="lg">+ Ajouter</Button>
			{/snippet}
		</TableHeader>
	{/snippet}
	<TableCollection
		collection={process_collection(data.collections.sessions, {
			fields: {
				hidden: 'email,identity,user,updated',

				snippets: {
					user_agent: { snippet: user_agent },
					controls: { snippet: controls, index: 6 }
				}
			}
		})}
		query={{ filter: `user = "${user.id}"`, sort: '-created' }}
	/>
</Section>

{#snippet user_agent(row: RecordModel)}
	<div class="flex items-center gap-2">
		{row.user_agent}
		{#if row.id == data.session?.id}
			<div class="w-fit bg-blue px-1.5 text-xs">vous</div>
		{/if}
	</div>
{/snippet}

{#snippet controls(row: RecordModel)}
	<div class="flex items-center justify-end">
		{#if !row.verified}
			<Button icon="icon-[ri--key-line]" variant="ghost" onclick={() => see_invite(row)} />
			<Button
				icon="icon-[ri--delete-bin-line]"
				variant="ghost"
				onclick={() => delete_session(row.id)}
			/>
			<!-- {:else}
			<Controls user={row} /> -->
		{/if}
	</div>
{/snippet}

{#if dialog_new_session.open}
	<DialogNewSession pop={dialog_new_session} />
{/if}
{#if dialog_see_session.open}
	<DialogShareInvite
		pop={dialog_see_session}
		invite={{ type: 'user', record: dialog_see_session.ctx }}
	/>
{/if}
<!-- 
<div class="mb-12">
	{#each sessions as session}
		<div>
			{session.id}
		</div>
	{/each}
</div>
<div class="max-w-md space-y-4x">
	<div>
		<div class="">
			Ta <PasskeyInfo /> est liée à cet appareil.
		</div>
		<div>Pour accéder à ton compte depuis un autre appareil :</div>
		<div>Génère un lien de couplage → ouvre-le sur le nouvel appareil.</div>
	</div>

	<Button icon="icon-[ri--key-line]" onclick={dialog_new_session.show} size="lg">
		Générer un lien de couplage
	</Button>
	<Info>
		Si tu utilises iCloud Keychain ou Google Password Manager, ta passkey est peut-être déjà
		disponible sur l'autre appareil.
	</Info>
</div> -->
<!-- {#if pop.open}
	<DialogNewSession {pop} />
{/if} -->
<!-- {#if pop.open && invite}
	<DialogShareInvite {pop} invite={{ type: 'device', record: invite }} />
{/if} -->
