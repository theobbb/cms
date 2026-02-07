<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { use_toaster } from '$lib/logic/toaster.svelte';

	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	const { data } = $props();

	const invite_user = $derived(data.invite);
	const invite_id = $derived(invite_user?.id);

	const toaster = use_toaster();
	$inspect(data);
	let loading = $state(false);
	let error = $state('');

	async function submit_passkey() {
		// event.preventDefault();
		// const form_data = new FormData(event.currentTarget, event.submitter);

		loading = true;
		error = '';
		// const name_or_email = form_data.get('name-or-email');
		try {
			// 1. Get options
			const res = await fetch(
				`/${page.params.app}/auth/api/authentification/request${page.url.search}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' }
				}
			);
			if (!res.ok) throw new Error('User not found');
			const { options } = await res.json();

			const publicKey = invite_id
				? PublicKeyCredential.parseCreationOptionsFromJSON(options)
				: PublicKeyCredential.parseRequestOptionsFromJSON(options);
			// 2. Native browser login

			const credential = invite_id
				? await navigator.credentials.create({ publicKey })
				: await navigator.credentials.get({ publicKey });

			if (!credential) throw new Error('Login cancelled');
			const credentialJSON = credential.toJSON();

			console.log(credentialJSON);
			// 3. Verify on server
			const verifyRes = await fetch(
				`/${page.params.app}/auth/api/authentification/verify${page.url.search}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ credential: credentialJSON })
				}
			);

			if (!verifyRes.ok) throw new Error('Invalid passkey');

			invalidateAll();
			//goto('/' + page.params.app);
			// Redirect user or update UI state
		} catch (err: any) {
			error = err.message || 'Login failed';
		} finally {
			loading = false;
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
	<div class="mx-auto my-24 flex max-w-2xs flex-col items-center gap-gap-y">
		<div class="text-xl">{data.app.title}</div>
		<div><Button size="lg" class="w-full" onclick={submit_passkey}>Connexion Passkey</Button></div>

		<!-- <form method="POST" action="?/signin" class="w-full space-y-3" use:enhance={submit_password}>
			<div>
				<Input
					class="w-full"
					name="email"
					label="email"
					type="email"
					required
					value={invite_user?.email || ''}
				/>
			</div>
			<div>
				<Input class="w-full" name="password" type="password" label="Password" required />
			</div>
			<div><Button size="lg" class="w-full" type="submit">Connexion</Button></div>
		</form> -->
	</div>
</div>
