<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import DialogPasskeys from '$lib/components/auth/dialog-passkeys.svelte';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';

	import { use_pocketbase } from '$lib/pocketbase';
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';

	const { data } = $props();
	const { user } = $derived(data);

	const toaster = use_toaster();

	const pocketbase = use_pocketbase();

	let dialog_passkey = new Pop();

	async function rename(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		const form = event.currentTarget;
		const form_data = new FormData(form, event.submitter);
		const name = form_data.get('name');

		if (!user?.id) return;
		try {
			await pocketbase.collection('users').update(user.id, { name });
			toaster.push('success');

			invalidateAll();
		} catch (err) {
			toaster.push('error');
		}
	}
</script>

<div class="mx-auto my-24 max-w-sm space-y-4">
	<div class="">
		{user?.email}
	</div>
	<form onsubmit={rename}>
		<Input class="w-full" label="Username" name="name" value={user?.name} />
		<div class="mt-2- text-right">
			<Button class="w-full border-t-0" size="lg" type="submit">Modifier</Button>
		</div>
	</form>

	<form class="" method="POST" action="/{page.params.app}/auth/signout">
		<Button type="submit">Déconnexion 😓</Button>
	</form>

	<div></div>
	<!-- <div>Thème</div> -->

	<Button onclick={dialog_passkey.show}>Se connecter autre device</Button>
</div>

{#if dialog_passkey.open}
	<DialogPasskeys pop={dialog_passkey} />
{/if}
