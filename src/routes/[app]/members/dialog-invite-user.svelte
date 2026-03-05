<script lang="ts">
	import { init_form_action } from '$lib/logic/form-action.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import DialogDescription from '$lib/ui/components/pop/dialog/dialog-description.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import ConfirmCancel from '$lib/ui/templates/confirm-cancel.svelte';
	import { type RecordModel } from 'pocketbase';

	const { pop, callback }: { pop: Pop; callback: (record: RecordModel) => void } = $props();

	let name: string = $state('');

	const form_action = init_form_action();

	async function create_user() {
		const temp_password = Math.random().toString(36).slice(-12);

		const created = await form_action.pocketbase.collection('users').create({
			name,
			password: temp_password,
			passwordConfirm: temp_password
		});
		pop.close();
		form_action.toaster.push('success');
		callback(created);
	}
</script>

<form class="contents" onsubmit={form_action.submit(create_user)}>
	<Dialog {pop}>
		<DialogHeader>
			<DialogTitle>Inviter un nouveau membre</DialogTitle>
			<DialogDescription>Inviter un nouveau membre</DialogDescription>
		</DialogHeader>

		<Input autofocus label="Nom" name="name" required bind:value={name} />

		<ConfirmCancel confirm="Inviter"></ConfirmCancel>
	</Dialog>
</form>
