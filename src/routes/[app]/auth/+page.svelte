<script lang="ts">
	import { enhance } from '$app/forms';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Invitation from './invitation.svelte';
	import Loader from '$lib/ui/components/loader.svelte';
	import AboutPasskeys from '$lib/ui/templates/about-passkeys.svelte';
	import Logo from '$lib/assets/logo.svelte';
	import { use_copy } from '$lib/copy/index.js';

	const { data } = $props();

	const copy = use_copy();
	const toaster = use_toaster();

	const options = $derived(data.options);

	const register_user = $derived(data.register);
	const pair_invite = $derived(data.pair);

	const is_new_credential = $derived(!!register_user || !!pair_invite);

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
			submitting = false;
			toaster.push('error');
			cancel();
		}
		return async ({ result, update }) => {
			if (result.type === 'redirect') toaster.push('success', copy.auth.toaster_success);
			else if (result.type === 'failure') toaster.push('error');
			await update();
			submitting = false;
		};
	};
</script>

<div class="mx-auto grid h-screen max-w-sm grid-rows-[1fr_auto] items-center">
	<div class="flex flex-col justify-center gap-4x py-4x">
		<div class="flex items-center justify-center gap-2 text-center text-2xl">
			<div>{data.app.title}</div>
			<div><Logo /></div>
			Atelier
		</div>
		<div class="text-center text-sm text-balance">
			<div>{copy.auth.description}</div>
		</div>

		{#if register_user}
			<Invitation name={register_user.name} />
		{:else if pair_invite}
			<Invitation name={pair_invite.name} />
		{/if}

		{#if data.error}
			<div class="text-red-600">{data.error}</div>
		{:else}
			<form class="mt-2x flex justify-center" method="POST" use:enhance={onsubmit}>
				<Button size="lg" class="flex items-center" type="submit" disabled={submitting}>
					<div class="-ml-1 flex size-5 items-center justify-center">
						{#if submitting}
							<Loader />
						{:else}
							<div class="icon-[ri--key-line] text-xl"></div>
						{/if}
					</div>
					Connexion
				</Button>
			</form>
		{/if}
	</div>

	<div class="flex justify-center">
		<div class="max-w-50 py-12 text-center">
			<AboutPasskeys />
		</div>
	</div>
</div>
