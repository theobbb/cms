<script module>
	export const roles = [
		{ label: 'Dev', value: '-1' },
		{ label: 'Administrateur', value: '0' },
		{ label: 'Éditeur', value: '1' },
		{ label: 'Lecteur', value: '2' }
	];
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import Select, { type SelectOption } from '$lib/ui/components/pop/select/select.svelte';
	import type { RecordModel } from 'pocketbase';

	let { user }: { user: RecordModel } = $props();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const role = $derived(user.role);
	const is_self = $derived(user.id == page.data.user.id);

	const self_role = $derived(parseInt(page.data.user.role));

	const available_roles = $derived(
		roles
			.map((r) => ({ ...r, disabled: parseInt(r.value) < self_role }))
			.filter((r) => (self_role == -1 ? true : parseInt(r.value) >= 0))
	);

	async function onchange(option: SelectOption) {
		await pocketbase.collection('users').update(user.id, { role: Number(option.value) });
		toaster.push('success');
	}
</script>

<div class="">
	{#if self_role >= role || is_self}
		{roles.find((r) => parseInt(r.value) == role)?.label}
	{:else}
		<Select name="role" value={String(role)} {onchange} options={available_roles} />
	{/if}
</div>

<!-- <Select name="role" bind:value={role} options={available_roles} /> -->
