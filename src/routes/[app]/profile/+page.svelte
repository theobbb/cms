<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import DialogInvite from '$lib/components/auth/dialog-share-invite.svelte';

	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';

	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/components/button.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte.js';
	import PairDevice from './pair-device.svelte';
	import Username from './username.svelte';

	const { data } = $props();
	const { user } = $derived(data);

	const toaster = use_toaster();

	const pocketbase = use_pocketbase();

	let dialog_passkey = new Pop();

	let name = $state(user.name);
	const has_changed = $derived(name != user.name);

	const form_action = init_form_action();

	const rename = form_action.submit(async ({ form_data }) => {
		if (!user?.id) return;

		await pocketbase.collection('users').update(user.id, form_data);
		toaster.push('success', `Renomé`);

		invalidateAll();
	});

	// async function rename(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
	// 	event.preventDefault();

	// 	const form = event.currentTarget;
	// 	const form_data = new FormData(form, event.submitter);

	// }
</script>

<div class="mx-auto my-24 max-w-sm space-y-4">
	<Username />
	<form onsubmit={rename}>
		<Input class="w-full" label="username" name="name" bind:value={name} />
		<div class="mt-2- text-right">
			<Button disabled={!has_changed} class="w-full border-t-0" size="lg" type="submit">
				Modifier
			</Button>
		</div>
	</form>

	<form class="" method="POST" action="/{page.params.app}/auth/signout">
		<Button type="submit">Déconnexion 😓</Button>
	</form>

	<div></div>
	<!-- <div>Thème</div> -->

	<PairDevice />

	<div>Supprimer le profil</div>
</div>

{#if dialog_passkey.open}
	<DialogInvite pop={dialog_passkey} invite />
{/if}
