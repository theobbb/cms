<script lang="ts">
	import { use_data_store } from '$lib/logic/data.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import FooterButtons from '$lib/ui/form/components/footer-buttons.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import type { Pop } from '$lib/ui/pop/pop-context.svelte';

	const { pop }: { pop: Pop } = $props();

	let name: string = $state('');

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		try {
			await pocketbase.collection('_user_invites').create({
				name,
				created_by: pocketbase.authStore.record?.id
			});

			// 1. Create the user with a random temporary password

			// 2. Trigger the "Invitation" (Password Reset) email
			//await pocketbase.collection('users').requestPasswordReset(email);

			toaster.push('success');
			//data_store.invalidate_collection('users');
			pop.close();
			//onclose();
		} catch (err) {
			toaster.push('error');
			console.error('Invitation failed:', err);
		}
	}

	async function create_user(email: string) {
		const temp_password = Math.random().toString(36).slice(-12);

		try {
			await pocketbase.collection('users').create({
				email,
				password: temp_password,
				passwordConfirm: temp_password
			});
			console.log('created');
		} catch (err: any) {
			// If the error is 400 (validation error/already exists), we ignore it.
			// This allows the invite() function to proceed to the reset email.
			if (err.status === 400) {
				console.log('User already exists, moving to send reset email.');
				return;
			}
			// If it's a different error (e.g. 403 Forbidden), throw it so invite() catches it.
			throw err;
		}
	}

	async function invite(email: string) {
		if (!email) return toaster.push('error', 'Email manquant');
		console.log(email);

		try {
			await create_user(email);

			// 2. Trigger the "Invitation" (Password Reset) email
			await pocketbase.collection('users').requestPasswordReset(email);
			toaster.push('success', 'Un courriel à été envoyé à ' + email);
		} catch (err) {
			toaster.push('error', 'Dsl, une erreur est survenue');
			console.error('Invitation failed:', err);
		}
	}
</script>

<Dialog {pop}>
	<div class="mb-gap-y">Inviter un nouvel utilisateur</div>
	<div>1h + guide</div>

	<form class="space-y-gap-y" {onsubmit}>
		<div>
			<Input placeholder="nom" name="name" required bind:value={name} />
		</div>
		<FooterButtons action="Invite"></FooterButtons>
		<!-- <Button size="lg" variant="action">Ajouter users</Button> -->
	</form>
</Dialog>
