<script lang="ts">
	import { page } from '$app/state';
	import DialogShareInvite from '$lib/components/auth/dialog-share-invite.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import type { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	const { pop }: { pop: Pop } = $props();

	const pocketbase = use_pocketbase();
	const user = $derived(page.data.user);

	let new_session: RecordModel | null = $state(null);

	async function get_pending_session(): Promise<RecordModel | null> {
		try {
			const record = await pocketbase
				.collection('_passkey_invites')
				.getFirstListItem(`user = "${user.id}"`);
			if (record && new Date(record.created) > new Date()) return null;
			return record;
		} catch (err) {
			return null;
		}
	}

	async function create_session(): Promise<RecordModel | null> {
		const identity = Math.random().toString(36).slice(-12);
		const pending_session = await get_pending_session();

		if (pending_session) return pending_session;
		try {
			const temp_password = Math.random().toString(36).slice(-12);

			const session = await pocketbase.collection('sessions').create({
				user: user.id,
				identity,
				password: temp_password,
				passwordConfirm: temp_password
			});
			return session;
		} catch {
			return null;
		}
	}

	onMount(async () => {
		new_session = await create_session();
	});
</script>

{#if new_session}
	<DialogShareInvite {pop} invite={{ type: 'device', record: new_session }} />
{/if}
