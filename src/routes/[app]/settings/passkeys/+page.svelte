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

<div class="max-w-md space-y-4x">
	<div>
		<div class="">
			Ta <PasskeyInfo /> est liée à cet appareil.
		</div>
		<div>Pour accéder à ton compte depuis un autre appareil :</div>
		<div>Génère un lien de couplage → ouvre-le sur le nouvel appareil.</div>
	</div>

	<Button icon="icon-[ri--key-line]" onclick={pop.show} size="lg"
		>Générer un lien de couplage</Button
	>
	<Info>
		Si tu utilises iCloud Keychain ou Google Password Manager, ta passkey est peut-être déjà
		disponible sur l'autre appareil.
	</Info>
</div>
{#if pop.open && invite}
	<DialogShareInvite {pop} invite={{ type: 'device', record: invite }} />
{/if}
