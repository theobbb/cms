<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/components/button.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { use_toaster } from '../toaster/toaster-context.svelte';
	import type { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import RecordPresentable from '../record-presentable.svelte';
	import Warning from '$lib/ui/templates/box/warning.svelte';
	import Info from '$lib/ui/templates/box/info.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import DialogDescription from '$lib/ui/components/pop/dialog/dialog-description.svelte';

	type Invite = {
		type: 'user' | 'device';
		record: RecordModel;
	};

	const { pop, invite }: { pop: Pop; invite: Invite } = $props();

	const { type, record } = $derived(invite);

	const toaster = use_toaster();

	const invite_url = $derived(
		`${page.url.origin}/auth?${type == 'user' ? 'register' : 'pair'}=${record.id}`
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

<Dialog {pop} size="md">
	<DialogHeader>
		<DialogTitle>
			<div>
				<span class="mr-0.5 icon-[ri--key-line] translate-y-0.5"></span>
				{#if type == 'user'}
					Inviter un membre
				{:else}
					Connecter un nouvel appareil
				{/if}
			</div>
		</DialogTitle>
		<DialogDescription>Partagez ce lien manuellement avec le nouveau membre</DialogDescription>
	</DialogHeader>
	<!-- {#snippet header()}
		<div>
			<span class="mr-0.5 icon-[ri--key-line] translate-y-0.5"></span>
			{#if type == 'user'}
				Partager l'invitation
			{:else}
				Connecter un nouvel appareil
			{/if}
		</div>
	{/snippet} -->
	<div class="mt-2 space-y-gap-y">
		{#if type == 'user'}
			<div class="mb-8 flex items-center gap-1.5">
				<div class="icon-[ri--user-line]"></div>
				<div>
					<RecordPresentable {record} />
				</div>
			</div>
			<div class="mb-4"><Info>Partagez ce lien manuellement avec le nouveau membre</Info></div>
		{/if}
		<div class="space-y-3">
			{#if type == 'device'}
				<Warning
					>Ce lien à usage unique expire dans 10 minutes. Ne le partagez à personne d’autre.</Warning
				>
			{/if}

			<div class="mb-6">
				<div class="text-muted mb-2 text-sm">
					À ouvrir sur l'appareil où le compte sera utilisé.
				</div>
				<Button
					onclick={async () => {
						await navigator.clipboard.writeText(invite_url);
						toaster.push('info', 'Lien copié');
					}}
					variant="discrete"
					class="bg-surface border-surface-foreground flex w-full items-start justify-start gap-3 border px-3 py-1.5 pr-2.5 text-left leading-tight break-all"
				>
					<div>{invite_url}</div>
					<div class="icon-[ri--file-copy-line] shrink-0 translate-y-1"></div>
				</Button>
			</div>

			<div class="text-muted text-sm">
				Ce système utilise les passkeys pour l'authentification — aucun mot de passe requis. <a
					class="text-indigo-600"
					href="/help/passkeys">En savoir plus</a
				>
			</div>
		</div>
	</div>
</Dialog>
