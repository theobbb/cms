<script lang="ts">
	import Username from './username.svelte';

	const { data } = $props();
	const { user } = $derived(data);

	// async function rename(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
	// 	event.preventDefault();

	// 	const form = event.currentTarget;
	// 	const form_data = new FormData(form, event.submitter);

	// }
</script>

<div class="max-w-sm space-y-4x">
	<Username />

	<!-- <form class="" method="POST" action="/{page.params.app}/auth/signout">
		<Button type="submit">Déconnexion 😓</Button>
	</form> -->

	<!-- <PairDevice /> -->

	<!-- <div>Supprimer le profil</div> -->
</div>
<!-- 
{#if dialog_passkey.open}
	<DialogInvite pop={dialog_passkey} invite />
{/if} -->
