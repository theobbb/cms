<script lang="ts">
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import FooterButtons from '$lib/ui/templates/confirm-cancel.svelte';
	import { ClientResponseError, type RecordModel } from 'pocketbase';

	const { pop, callback }: { pop: Pop; callback: (record: RecordModel) => void } = $props();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	let name: string = $state('');

	const form_action = init_form_action();

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
		} catch (err) {
			if (err instanceof ClientResponseError) {
				// Field-level validation errors
				const fieldErrors = err.response?.data;
				console.log(err.response?.data);
				// e.g. { name: { code: "validation_not_unique", message: "Value must be unique." } }

				if (fieldErrors?.name) {
					toaster.push('error', fieldErrors.name.message); // "Value must be unique."
				}

				// Or loop over all field errors
				for (const [field, error] of Object.entries(fieldErrors ?? {})) {
					console.log(`${field}: ${(error as any).message}`);
				}

				// Top-level message (e.g. "Failed to create record.")
				console.log(err.message);

				// HTTP status code
				console.log(err.status); // 400, 403, etc.
			}
			toaster.push('error');
			console.error('Invitation failed:', err);
		}
	}
</script>

<Dialog {pop}>
	{#snippet header()}
		Inviter un nouveau membre
	{/snippet}

	<form class="mt-2 space-y-gap-y" {onsubmit}>
		<div>
			<Input autofocus label="Nom" name="name" required bind:value={name} />
		</div>
		<FooterButtons action="Invite"></FooterButtons>
	</form>
</Dialog>
