<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/components/button.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import type { RecordModel } from 'pocketbase';
	import { use_toaster } from '../toaster/toaster-context.svelte';
	import type { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import RecordPresentable from '../record-presentable.svelte';
	import Warning from '$lib/ui/templates/flags/warning.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import DialogDescription from '$lib/ui/components/pop/dialog/dialog-description.svelte';
	import AboutPasskeys from '$lib/ui/templates/about-passkeys.svelte';

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

	async function copy_link() {
		await navigator.clipboard.writeText(invite_url);
		toaster.push('info', 'Lien copié');
	}
</script>

<Dialog {pop} size="sm">
	<DialogHeader>
		<DialogTitle>
			<div>
				<span class="mr-0.5 icon-[ri--key-line] translate-y-0.5"></span>
				{#if type == 'user'}
					Lien d'invitation
				{:else}
					Lien de couplage
				{/if}
			</div>
		</DialogTitle>
		<DialogDescription>
			{#if type == 'user'}
				À envoyer manuellement à

				<span class="underline"><RecordPresentable {record} /></span>
			{:else}
				À ouvrir sur le nouvel appareil
			{/if}
		</DialogDescription>
	</DialogHeader>

	<div class="space-y-2x">
		<Button
			onclick={copy_link}
			variant="discrete"
			class="flex w-full items-start justify-start gap-3 border border-surface-foreground bg-surface px-2.5 py-1.5 pr-2.5 text-left leading-tight break-all"
		>
			<div>{invite_url}</div>
			<div class="icon-[ri--file-copy-line] shrink-0 translate-y-1"></div>
		</Button>
		{#if type == 'user'}
			<Warning>À ouvrir sur l'appareil cible</Warning>
		{:else}
			<Warning>Usage unique · Expire dans 24h · Ne pas partager</Warning>
		{/if}
	</div>

	<AboutPasskeys />
</Dialog>
