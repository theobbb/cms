<script lang="ts">
	import { enhance } from '$app/forms';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import Button from '$lib/ui/button.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Invitation from './invitation.svelte';

	const { data } = $props();
	const options = $derived(data.options);
	const register_user = $derived(data.register);
	const pair_invite = $derived(data.pair);
	const is_new_credential = $derived(!!register_user || !!pair_invite);
	const toaster = use_toaster();
	let submitting = $state(false);

	const onsubmit: SubmitFunction = async ({ formData, cancel }) => {
		if (submitting) return;
		submitting = true;
		try {
			if (!options) throw new Error('Initialization failed. Try refreshing.');

			const publicKey = is_new_credential
				? PublicKeyCredential.parseCreationOptionsFromJSON(
						options as PublicKeyCredentialCreationOptionsJSON
					)
				: PublicKeyCredential.parseRequestOptionsFromJSON(
						options as PublicKeyCredentialRequestOptionsJSON
					);

			const credential = is_new_credential
				? await navigator.credentials.create({
						publicKey: publicKey as PublicKeyCredentialCreationOptions
					})
				: await navigator.credentials.get({
						publicKey: publicKey as PublicKeyCredentialRequestOptions
					});

			if (!credential) throw new Error('Login cancelled');
			formData.set('credential', JSON.stringify((credential as any).toJSON()));
		} catch (err: any) {
			toaster.push('error');
			console.error(err);
			cancel();
		}
		return async ({ result, update }) => {
			if (result.type === 'redirect') toaster.push('success');
			else if (result.type === 'failure') toaster.push('error');
			await update();
			submitting = false;
		};
	};

	const button_label = $derived(
		submitting
			? 'Connexion...'
			: pair_invite
				? 'Ajouter un nouvel appareil'
				: register_user
					? 'Register with Passkey'
					: 'Sign in with Passkey'
	);
</script>

<div class="mx-auto my-24 flex max-w-2xl flex-col items-center gap-6">
	<div class="text-xl">Authentication</div>

	{#if register_user}
		<Invitation name={register_user.name} />
	{:else if pair_invite}
		<Invitation name={pair_invite.expand?.user?.name} />
	{/if}

	{#if data.error}
		<div class="text-red-500">{data.error}</div>
	{:else}
		<form method="POST" use:enhance={onsubmit}>
			<Button size="lg" class="flex w-full items-center gap-2" type="submit" disabled={submitting}>
				<div class="icon-[ri--key-line] text-xl"></div>
				{button_label}
			</Button>
		</form>
	{/if}

	<div>
		<p class="text-center text-sm text-gray-600">
			Need help?
			<a href="/help/passkeys" class="font-medium text-indigo-600 hover:text-indigo-700">
				View guide →
			</a>
		</p>
	</div>
</div>
