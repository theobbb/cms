<script lang="ts">
	import { enhance } from '$app/forms';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import Button from '$lib/ui/button.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Invitation from './invitation.svelte';

	const { data } = $props();

	// Access data returned from the server load function
	const register_user = $derived(data.register);
	const options = $derived(data.options);

	const toaster = use_toaster();
	let submitting = $state(false);

	const onsubmit: SubmitFunction = async ({ formData, cancel }) => {
		if (submitting) return;
		submitting = true;

		//const toast = toaster.push('loading', 'Waiting for passkey...');

		try {
			if (!options) throw new Error('Initialization failed. Try refreshing.');

			// 1. Parse Options (using data from server, no fetch needed)
			const publicKey = register_user
				? PublicKeyCredential.parseCreationOptionsFromJSON(options)
				: PublicKeyCredential.parseRequestOptionsFromJSON(options);

			// 2. Get credential from browser
			// This will prompt the user (TouchID/FaceID/etc)
			const credential = register_user
				? await navigator.credentials.create({ publicKey })
				: await navigator.credentials.get({ publicKey });

			if (!credential) throw new Error('Login cancelled');

			// 3. Prepare form data
			const credentialJSON = credential.toJSON();
			formData.set('credential', JSON.stringify(credentialJSON));

			toaster.push('success');
		} catch (err: any) {
			submitting = false;
			toaster.push('error');
			console.error(err);
			cancel();
		}

		return async ({ result, update }) => {
			if (result.type === 'redirect') {
				//toaster.push('success', 'Welcome!');
			} else if (result.type === 'failure') {
				//toaster.update(toast, 'error', result.data?.message || 'Verification failed');
			}
			await update();
			submitting = false;
		};
	};
</script>

<div class="mx-auto my-24 flex max-w-2xl flex-col items-center gap-6">
	<div class="text-xl">Authentication</div>
	{#if register_user}
		<Invitation email={register_user.email} />
	{/if}

	{#if data.error}
		<div class="text-red-500">{data.error}</div>
	{:else}
		<form method="POST" use:enhance={onsubmit}>
			<Button size="lg" class="flex w-full items-center gap-2" type="submit" disabled={submitting}>
				<div class="icon-[ri--key-line] text-xl"></div>
				{submitting ? 'Connecting...' : 'Connect with Passkey'}
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
