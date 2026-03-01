<script lang="ts">
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';
	import FooterButtons from '$lib/ui/templates/footer-buttons.svelte';
	import type { RecordModel } from 'pocketbase';

	const { pop, callback }: { pop: Pop; callback: (record: RecordModel) => void } = $props();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	let name: string = $state('');

	const pop_share_invite = new Pop();
	let invite_created: RecordModel | null = $state(null);

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		const temp_password = Math.random().toString(36).slice(-12);
		try {
			const created = await pocketbase.collection('users').create({
				name,
				password: temp_password,
				passwordConfirm: temp_password
			});
			pop.close();
			toaster.push('success');
			callback(created);
			//pop_share_invite.show();
			//data_store.invalidate_collection('users');
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
	const pop2 = new Pop();
</script>

<Dialog {pop}>
	<Button onclick={pop2.show}>test</Button>
	<div class="mb-gap-y">Inviter un nouvel membre</div>
	<div>1h + guide</div>

	<form class="space-y-gap-y" {onsubmit}>
		<div>
			<Input autofocus placeholder="nom" label="Nom" name="name" required bind:value={name} />
		</div>
		<FooterButtons {pop} action="Invite"></FooterButtons>
		<!-- <Button size="lg" variant="action">Ajouter users</Button> -->
	</form>
</Dialog>

<!-- {#if pop2.open}
	<Dialog pop={pop2}>gregre</Dialog>
{/if} -->
