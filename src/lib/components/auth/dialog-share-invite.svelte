<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/button.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { use_toaster } from '../toaster/toaster-context.svelte';
	import Box from '../box.svelte';
	import type { Pop } from '$lib/ui/pop/pop-context.svelte';
	import RecordPresentable from '../record-presentable.svelte';

	type Invite = {
		type: 'user' | 'device';
		record: RecordModel;
	};

	const { pop, invite }: { pop: Pop; invite: Invite } = $props();

	const { type, record } = $derived(invite);

	const toaster = use_toaster();

	const invite_url = $derived(
		`${page.url.origin}/auth?${type == 'user' ? 'register' : 'pair'}=${record.id}${type == 'device' ? `&token=${record.token?.device_invite_token}` : ''}`
	);

	let QR: string | null = $state(null);

	async function generate_QR() {
		if (!invite_url) return;
		try {
			QR = await QRCode.toString(invite_url, {
				type: 'svg',
				color: {
					dark: '#242424',
					light: '#00000000'
				}
			});
		} catch (err) {}
	}

	onMount(() => {
		generate_QR();
	});
</script>

<Dialog {pop} size="sm">
	<div>
		<div class="icon-[ri--key-line] text-4xl"></div>
		{#if type == 'user'}
			<div>Partage du lien de connexion</div>
			<div class="flex items-center gap-1.5">
				<div class="icon-[ri--user-line]"></div>
				<div>
					<RecordPresentable {record} />
				</div>
			</div>
		{:else}
			<div>
				<div>Connecter un autre appareil</div>
				<div>Ce système d'authentification utilise les <span>passkeys</span></div>
				<div><a href="/help/passkeys">en savoir plus</a></div>
			</div>
		{/if}

		<div class="space-y-3">
			{#if type == 'device'}
				<Box color="yellow">
					<div>Ce lien est valide pour 10 minutes. Ne le partagez pas</div>
				</Box>
			{/if}
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
	</div>
</Dialog>
