<script lang="ts">
	import { page } from '$app/state';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { use_toaster } from '../toaster/toaster-context.svelte';
	import Box from '../box.svelte';

	const { pop } = $props();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const user_id = $derived(page.data.user?.id);

	let invite: RecordModel | null = $state(null);
	const invite_url = $derived(invite ? `${page.url.origin}/auth?pair=${invite?.id}` : '');
	let loaded = $state(false);

	let QR: string | null = $state(null);

	async function fetch_invite() {
		if (!user_id) return;

		invite = await get_existing_invite();
		if (!invite) invite = await create_invite();

		generate_QR();
		loaded = true;
	}

	async function get_existing_invite() {
		try {
			const invite = await pocketbase
				.collection('_passkey_invites')
				.getFirstListItem(`user = "${user_id}"`);
			return invite;
		} catch (err) {
			return null;
		}
	}

	async function create_invite() {
		try {
			const invite = await pocketbase.collection('_passkey_invites').create({ user: user_id });
			return invite;
		} catch (err) {
			return null;
		}
	}

	async function generate_QR() {
		if (!invite) return;
		const url = `${page.url.origin}/auth?pair=${invite.id}`;
		console.log(url);
		try {
			QR = await QRCode.toString(url, { type: 'svg' });
		} catch (err) {}
	}

	$inspect(invite);

	onMount(() => {
		fetch_invite();
	});
</script>

<Dialog {pop}>
	<div>
		<div>Connecter un autre appareil</div>
		<div>Ce système d'authentification utilise les <span>passkeys</span></div>
		<div><a href="/help/passkeys">en savoir plus</a></div>
	</div>
	{#if loaded}
		<div class="space-y-3">
			<Box color="yellow">
				<div>Ce lien est valide pour 10 minutes. Ne le partagez pas</div>
			</Box>
			<Button
				onclick={async () => {
					await navigator.clipboard.writeText(invite_url);
					toaster.push('info', 'Lien copié');
				}}
				variant="discrete"
				class="bg-surface border-surface-foreground flex w-full items-center justify-start gap-1.5 truncate border px-2 py-0.5"
			>
				<div class="icon-[ri--file-copy-line] shrink-0"></div>
				<div class="">
					{invite_url}
				</div>
			</Button>
			<div>
				{@html QR}
			</div>
		</div>
	{:else}
		...loading
	{/if}
</Dialog>
