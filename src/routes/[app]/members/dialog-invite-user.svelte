<script lang="ts">
	import { init_form_action } from '$lib/logic/form-action.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import { type RecordModel } from 'pocketbase';
	import PopConfirmCancel from '$lib/ui/templates/pop-confirm-cancel.svelte';
	import { use_copy } from '$lib/copy';

	const { pop, callback }: { pop: Pop; callback: (record: RecordModel) => void } = $props();

	const copy = use_copy();
	const form_action = init_form_action();

	let name: string = $state('');

	async function create_user() {
		const temp_password = Math.random().toString(36).slice(-12);

		const created = await form_action.pocketbase.collection('users').create({
			name,
			password: temp_password,
			passwordConfirm: temp_password
		});
		pop.close();
		form_action.toaster.push('success', copy.members.dialog_invite_new_member.toast_sucess);
		callback(created);
	}
</script>

<form class="contents" onsubmit={form_action.submit(create_user)}>
	<Dialog {pop}>
		<DialogHeader>
			<DialogTitle>
				{copy.members.dialog_invite_new_member.title}
			</DialogTitle>
		</DialogHeader>

		<Input
			autofocus
			label={copy.members.dialog_invite_new_member.fields.name}
			name="name"
			required
			bind:value={name}
		/>

		<PopConfirmCancel confirm={copy.members.dialog_invite_new_member.confirm} />
	</Dialog>
</form>
