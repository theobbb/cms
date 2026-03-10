<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';
	import Button from '$lib/ui/components/button.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';

	const { user } = $derived(page.data);

	let name = $state(user.name);
	const has_changed = $derived(name != user.name);

	const form_action = init_form_action();

	const rename = form_action.submit(async ({ form_data }) => {
		if (!user?.id) return;

		await form_action.pocketbase.collection('users').update(user.id, form_data);
		form_action.toaster.push('success');

		invalidateAll();
	});
</script>

<form onsubmit={rename}>
	<Input class="w-full" label="username" name="name" bind:value={name} />
	<div class="mt-2 text-right">
		<Button disabled={!has_changed} size="lg" type="submit">Enregistrer</Button>
	</div>
</form>
