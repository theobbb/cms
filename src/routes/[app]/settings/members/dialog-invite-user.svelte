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
	import Select from '$lib/ui/components/pop/select/select.svelte';
	import { page } from '$app/state';
	import { roles } from './select-role.svelte';

	const { pop, callback }: { pop: Pop; callback: (record: RecordModel) => void } = $props();

	const copy = use_copy();
	const form_action = init_form_action();

	const self_role = parseInt(page.data.user.role);

	let name: string = $state('');
	let role: string = $state(String(self_role));

	const available_roles = $derived(
		roles
			.map((r) => ({ ...r, disabled: parseInt(r.value) < self_role }))
			.filter((r) => (self_role == -1 ? true : parseInt(r.value) >= 0))
	);

	const onsubmit = form_action.submit(async () => {
		const identity = Math.random().toString(36).slice(-12);
		const temp_password = Math.random().toString(36).slice(-12);

		const new_user = await form_action.pocketbase.collection('users').create({
			name,
			role
		});

		const session = await form_action.pocketbase.collection('sessions').create({
			user: new_user.id,
			identity,
			password: temp_password,
			passwordConfirm: temp_password
		});

		pop.close();
		form_action.toaster.push('success', copy.members.dialog_invite_new_member.toast_sucess);
		callback(session);
	});
</script>

<form class="contents" {onsubmit}>
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
		<div class="space-y-1">
			<div class="text-xs text-muted">role</div>
			<Select name="role" bind:value={role} options={available_roles} />
		</div>

		<PopConfirmCancel confirm={copy.members.dialog_invite_new_member.confirm} />
	</Dialog>
</form>
