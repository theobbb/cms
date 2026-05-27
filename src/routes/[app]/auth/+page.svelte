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
	import Input from '$lib/ui/components/form/fields/input.svelte';

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
	<div class="flex flex-col items-center justify-center gap-8 py-4x">
		<div class="flex flex-col items-center justify-center gap-2 text-center">
			<div class="text-4xl"><Logo /></div>
			<div class="text-xl">{data.app.title}</div>
		</div>
		<!-- <div class="text-center text-sm text-balance">
			<div>{copy.auth.description}</div>
		</div> -->

		{#if register_user}
			<Invitation name={register_user.name} />
		{:else if pair_invite}
			<Invitation name={pair_invite.name} />
		{/if}

		{#if data.error}
			<div class="text-red-600">{data.error}</div>
		{:else}
			<form
				class="mt-2x flex w-full flex-col items-center justify-center gap-4"
				method="POST"
				use:enhance={onsubmit}
			>
				{#if is_new_credential}
					<div class="w-full">
						<Input name="device_name" label="Identifiant de l’appareil" class="w-full" required />
					</div>
				{/if}
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
