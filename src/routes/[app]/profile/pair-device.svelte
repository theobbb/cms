<script lang="ts">
	import { page } from '$app/state';
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';
	import { onMount } from 'svelte';

	type Token = {
		device_invite_token: string;
		device_invite_expires: string;
	};

	const pocketbase = use_pocketbase();

	const pop = new Pop();

	let token: Token | null = $state(null);

	const user = $derived({ ...page.data.user, token });

	async function refresh_token() {
		if (user.device_invite_token && new Date(user.device_invite_expires) > new Date()) return;

		token = {
			device_invite_token: crypto.randomUUID(),
			device_invite_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString()
		};
		sync_token(token);
	}

	async function sync_token(new_token: Token) {
		try {
			await pocketbase.collection('users').update(user.id, new_token);
		} catch (err) {
			return null;
		}
	}

	onMount(() => {
		refresh_token();
	});
</script>

<Button onclick={pop.show}>Se connecter avec un autre appareil</Button>

{#if pop.open}
	<DialogShareInvite {pop} invite={{ type: 'device', record: user }} />
{/if}
