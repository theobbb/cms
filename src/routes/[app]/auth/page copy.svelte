<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { use_toaster } from '$lib/logic/toaster.svelte';
	import Button from '$lib/ui/button.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Invitation from './invitation.svelte';

	const { data } = $props();

	const register_user = $derived(data.register);
	const register_id = $derived(register_user?.id);

	const toaster = use_toaster();

	async function submit_passkey() {
		// event.preventDefault();
		// const form_data = new FormData(event.currentTarget, event.submitter);

		const toast = toaster.push('loading', 'Waiting for passkey');

		// const name_or_email = form_data.get('name-or-email');
		try {
			// 1. Get options
			const res = await fetch(page.url.pathname + page.url.search);
			if (!res.ok) throw new Error('User not found');
			const options = await res.json();

			const publicKey = register_id
				? PublicKeyCredential.parseCreationOptionsFromJSON(options)
				: PublicKeyCredential.parseRequestOptionsFromJSON(options);
			// 2. Native browser login
			console.log(publicKey);
			const credential = register_id
				? await navigator.credentials.create({ publicKey })
				: await navigator.credentials.get({ publicKey });

			if (!credential) throw new Error('Login cancelled');
			const credentialJSON = credential.toJSON();

			console.log(credentialJSON);
			// 3. Verify on server
			const verifyRes = await fetch(page.url.pathname + page.url.search, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ credential: credentialJSON })
			});

			if (!verifyRes.ok) throw new Error('Invalid passkey');

			toaster.update(toast, 'success');

			// invalidateAll();
			goto('/', { invalidateAll: true });
			//goto('/' + page.params.app);
			// Redirect user or update UI state
		} catch (err: any) {
			toaster.update(toast, 'error');
			console.error(err);
		}
		// return async ({ result, update }) => {
		// 	if (result.type === 'failure') {
		// 		toaster.push('error', (result.data?.message as string) || 'Erreur inconnue');
		// 	}
		// 	if (result.type === 'redirect') {
		// 		toaster.push('success', 'Bienvenue !');
		// 	}
		// 	update();
		// };
	}

	const submit_password: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'failure') {
				toaster.push('error', (result.data?.message as string) || 'Erreur inconnue');
			}
			if (result.type === 'redirect') {
				toaster.push('success', 'Bienvenue !');
			}
			update();
		};
	};
</script>

<div class="">
	<div class="max-w-2xs- mx-auto my-24 flex max-w-xl flex-col items-center gap-gap-y">
		<div class="text-xl">{data.app.title}</div>
		{#if register_user}
			<div>
				<Invitation email={register_user.email} />
			</div>
		{/if}

		<div>
			<Button size="lg" class="flex w-full items-center gap-2" onclick={submit_passkey}>
				<div class="icon-[ri--key-line] text-xl"></div>
				Connect
			</Button>
		</div>
		<div>
			<p class="text-center text-sm text-gray-600">
				Need help?
				<a href="/help/passkeys" class="font-medium text-indigo-600 hover:text-indigo-700">
					View guide →
				</a>
			</p>
		</div>

		<div>
			<!-- <WhatArePasskeys /> -->
		</div>
		<!-- <form method="POST" action="?/signin" class="w-full space-y-3" use:enhance={submit_password}>
			<div>
				<Input
					class="w-full"
					name="email"
					label="email"
					type="email"
					required
					value={register_user?.email || ''}
				/>
			</div>
			<div>
				<Input class="w-full" name="password" type="password" label="Password" required />
			</div>
			<div><Button size="lg" class="w-full" type="submit">Connexion</Button></div>
		</form> -->
	</div>
</div>
