<script lang="ts">
	import { page } from '$app/state';
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import { onMount } from 'svelte';
	import type { RecordModel } from 'pocketbase';

	type Token = {
		device_invite_token: string;
		device_invite_expires: string;
	};

	const pocketbase = use_pocketbase();

	const pop = new Pop();

	let invite: RecordModel | null = $state(null);

	const user = $derived(page.data.user);

	$inspect(page.data.user);

	async function fetch_invite() {
		invite = await get_existing_invite();
		if (!invite) invite = await create_invite();
	}

	async function get_existing_invite() {
		try {
			const record = await pocketbase
				.collection('_passkey_invites')
				.getFirstListItem(`user = "${user.id}"`);
			if (record && new Date(record.created) > new Date()) return null;
			return record;
		} catch (err) {
			return null;
		}
	}

	async function create_invite() {
		try {
			return await pocketbase.collection('_passkey_invites').create({ user: user.id });
		} catch {
			return null;
		}
	}

	onMount(() => {
		fetch_invite();
	});
</script>

<Button onclick={pop.show}>Connecter un autre appareil</Button>

{#if pop.open && invite}
	<DialogShareInvite {pop} invite={{ type: 'device', record: invite }} />
{/if}
