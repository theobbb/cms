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
	import type { Pop } from '$lib/ui/pop/pop-context.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import FooterButtons from '$lib/ui/templates/footer-buttons.svelte';

	const {
		pop,
		type,
		...props
	}: { pop: Pop } & ({ type: 'user'; name?: string } | { type: 'passkey' }) = $props();

	let input_name = $state('');
	let name = $derived(type === 'user' ? (props as { name: string }).name : undefined);

	const type_user = $derived(type == 'user');

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const invite_collection = $derived(type == 'user' ? '_user_invites' : '_passkey_invites');

	const user_id = $derived(page.data.user?.id);

	let invite: RecordModel | null = $state(null);
	const invite_url = $derived(
		invite ? `${page.url.origin}/auth?${type == 'user' ? 'register' : 'pair'}=${invite?.id}` : ''
	);
	let loaded = $state(false);

	let QR: string | null = $state(null);

	async function fetch_invite() {
		if (!user_id) return;

		if (invite) return;

		invite = await get_existing_invite();
		if (!invite) invite = await create_invite();

		generate_QR();
		loaded = true;
	}

	async function get_existing_invite() {
		try {
			if (type == 'user') {
				return await pocketbase.collection('_user_invites').getFirstListItem(`name = "${name}"`);
			} else {
				return await pocketbase
					.collection('_passkey_invites')
					.getFirstListItem(`user = "${user_id}"`);
			}
		} catch (err) {
			return null;
		}
	}

	async function create_invite() {
		try {
			const data = type === 'user' ? { user: user_id, name } : { user: user_id };
			return await pocketbase.collection(invite_collection).create(data);
		} catch {
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

	async function onsubmit_name(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const random_password = crypto.randomUUID();
		try {
			invite = await pocketbase.collection('users').create({
				name: input_name,
				verified: false,
				password: random_password,
				confirmPassword: random_password
			});
			name = input_name;

			// 1. Create the user with a random temporary password

			// 2. Trigger the "Invitation" (Password Reset) email
			//await pocketbase.collection('users').requestPasswordReset(email);

			toaster.push('success');
			//data_store.invalidate_collection('users');
			pop.close();
			//onclose();
		} catch (err) {
			toaster.push('error');
			console.error('Invitation failed:', err);
		}
	}
</script>

<Dialog {pop}>
	<div>
		{#if type == 'user' && !name}
			<div class="mb-gap-y">Inviter un nouvel utilisateur</div>
			<div>1h + guide</div>

			<form class="space-y-gap-y" onsubmit={onsubmit_name}>
				<div>
					<Input placeholder="nom" name="name" required bind:value={input_name} />
				</div>
				<FooterButtons action="Invite"></FooterButtons>
				<!-- <Button size="lg" variant="action">Ajouter users</Button> -->
			</form>
		{:else}
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
		{/if}
	</div>
</Dialog>
