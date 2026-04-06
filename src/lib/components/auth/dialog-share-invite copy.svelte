<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/components/button.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { use_toaster } from '../toaster/toaster-context.svelte';
	import Box from '../box.svelte';
	import type { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import RecordPresentable from '../record-presentable.svelte';
	import Warning from '$lib/ui/templates/flags/warning.svelte';
	import Info from '$lib/ui/templates/flags/info.svelte';

	type Invite = {
		type: 'user' | 'device';
		record: RecordModel;
	};

	const { pop, invite }: { pop: Pop; invite: Invite } = $props();

	const { type, record } = $derived(invite);

	const toaster = use_toaster();

	const invite_url = $derived(
		`${page.url.origin}/auth?${type == 'user' ? 'register' : 'pair'}=${record.id}${type == 'device' ? `&token=${record.device_invite_token}` : ''}`
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
	{#snippet header()}
		{#if type == 'user'}
			<div>Partager l'invitation</div>
		{:else}
			<div>
				<div>Connecter un autre appareil</div>
			</div>
		{/if}
	{/snippet}
	<div class="space-y-gap-y">
		{#if type == 'user'}
			<div class="flex items-center gap-1.5">
				<div class="icon-[ri--user-line]"></div>
				<div>
					<RecordPresentable {record} />
				</div>
			</div>
			<Info>
				Ce système n'envoie pas de courriel. C'est à vous de partager l'invitation avec le nouveau
				membre.
			</Info>
		{/if}
		<div class="space-y-3">
			{#if type == 'device'}
				<Warning>
					<div>Ce lien est valide pour 10 minutes. Ne le partagez pas</div>
				</Warning>
			{/if}
			<div>
				<div class="mb-2 text-foreground">Lien de connexion à usage unique (recommandé)</div>
				<Button
					onclick={async () => {
						await navigator.clipboard.writeText(invite_url);
						toaster.push('info', 'Lien copié');
					}}
					variant="discrete"
					class="flex w-full items-start justify-start gap-1.5 border border-surface-foreground bg-surface px-2 py-0.5 text-left leading-tight"
				>
					<div class="icon-[ri--file-copy-line] shrink-0 translate-y-1"></div>
					<div class="">
						{invite_url}
					</div>
				</Button>
			</div>

			<div class="my-12 space-y-2">
				<div class="size-48">
					{@html QR}
				</div>
				<div>
					<Warning>
						Utilisez le code QR seulement si le nouveau membre utilise des passkeys connectés entre
						ses appareils
					</Warning>
				</div>
			</div>
			<div>
				Ce système utilise les passkeys. <a class="text-indigo-600" href="/help/passkeys"
					>En savoir plus</a
				>
			</div>
		</div>
	</div>
</Dialog>
