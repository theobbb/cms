<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import DropdownMenu from '$lib/ui/components/pop/dropdown-menu/dropdown-menu.svelte';
	import type { RecordModel } from 'pocketbase';
	import type { Snippet } from 'svelte';

	const { user }: { user: RecordModel } = $props();
	const props_id = $props.id();

	const pocketbase = use_pocketbase();

	const pop = new Pop();

	async function delete_user() {
		const confirmed = await confirm(is_self ? 'Quitter le projet ?' : 'Supprimer ce membre ?');
		if (!confirmed) return;

		try {
			await pocketbase.collection('users').delete(user.id);
			if (is_self) signout();
		} catch (err) {}
	}

	async function signout() {
		await fetch(`/${page.params.app}/auth/signout`, { method: 'POST' });
		goto(`/${page.params.app}/auth`, { invalidateAll: true });
	}

	const is_self = $derived(user.id == page.data.user.id);
</script>

{#if user.role < page.data.user.role || is_self}
	<div class="">
		<Button
			icon="icon-[ri--more-fill]"
			onclick={pop.toggle}
			variant="ghost"
			style="anchor-name: --user-controls-{props_id};"
		/>
		<DropdownMenu
			{pop}
			options={[
				{
					type: 'button',
					label: is_self ? 'Quitter' : 'Supprimer',
					action: delete_user,
					icon: 'icon-[ri--delete-bin-line]'
				}
			]}
			anchor="--user-controls-{props_id}"
			bottom="top"
			right="right"
		/>
	</div>
{/if}
