<script lang="ts">
	import { page } from '$app/state';
	import DialogInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	const pop_info = new Pop();
	const pop_link = new Pop();

	const pocketbase = use_pocketbase();

	let invite: RecordModel | null = $state(null);
	const user_id = $derived(page.data.user?.id);

	let loaded = $state(false);

	async function fetch_invite() {
		if (!user_id) return;

		invite = await get_existing_invite();
		if (!invite) invite = await create_invite();

		loaded = true;
	}

	async function get_existing_invite() {
		try {
			return await pocketbase
				.collection('_passkey_invites')
				.getFirstListItem(`user = "${user_id}"`);
		} catch (err) {
			return null;
		}
	}

	async function create_invite() {
		try {
			return await pocketbase.collection('_passkey_invites').create({ user: user_id });
		} catch {
			return null;
		}
	}

	onMount(() => {
		fetch_invite();
	});
</script>

<Button onclick={pop_info.show}>Se connecter avec un autre appareil</Button>

{#if pop_info.open}
	<Dialog pop={pop_info}>
		<div>Fonctionnement</div>
		<Button onclick={pop_link.show}>Générer</Button>
	</Dialog>
{/if}

{#if pop_link.open && invite?.id}
	<DialogInvite pop={pop_link} invite={{ type: 'passkey', id: invite.id }} />
{/if}
