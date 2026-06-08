<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { page } from '$app/state';
	import Logo from '$lib/assets/logo.svelte';
	import { use_copy } from '$lib/copy/index.js';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';
	import Button from '$lib/ui/components/button.svelte';
	import Loader from '$lib/ui/components/loader.svelte';
	import CardSession from '$lib/ui/templates/auth/card-session.svelte';
	import type { ActionResult } from '@sveltejs/kit';

	const { data } = $props();
	const copy = use_copy();

	const token = $derived(page.url.searchParams.get('register'));

	const form_action = init_form_action();

	const onsubmit = form_action.submit(async ({ form_data }) => {
		try {
			const response = await fetch(page.url.href, {
				method: 'POST',
				body: form_data
			});

			const result: ActionResult = deserialize(await response.text());
			applyAction(result);
			form_action.toaster.push('success', copy.auth.toaster_success);
		} catch (err: any) {
			form_action.toaster.push('error');
		}
	});
</script>

<div class="mx-auto grid h-screen max-w-sm grid-rows-[1fr_auto] items-center">
	<div class="flex flex-col items-center justify-center gap-8 py-4x">
		<div class="flex flex-col items-center justify-center gap-2 text-center">
			<div class="text-4xl"><Logo /></div>
			<div class="text-xl">{data.app.title}</div>
		</div>

		{#if data.session}
			<CardSession session={data.session} />
			<div class="mt-2">Attention! Cette session sera écrasée si vous rejoignez celle-ci.</div>
		{/if}

		<div>
			{#if token}
				{data.user?.name}
				<form
					class="mt-2x flex w-full flex-col items-center justify-center gap-4"
					method="POST"
					{onsubmit}
				>
					<!-- {#if is_new_credential}
					<div class="w-full">
						<Input name="device_name" label="Identifiant de l’appareil" class="w-full" required />
					</div>
				{/if} -->
					<Button
						size="lg"
						class="flex items-center"
						type="submit"
						disabled={form_action.submitting}
					>
						<div class="-ml-1 flex size-5 items-center justify-center">
							{#if form_action.submitting}
								<Loader />
							{:else}
								<div class="icon-[ri--key-line] text-xl"></div>
							{/if}
						</div>
						Connexion
					</Button>
				</form>
			{:else}
				No token
			{/if}
		</div>
	</div>
</div>

<!-- 
<div class="mx-auto grid h-screen max-w-sm grid-rows-[1fr_auto] items-center">
	<div class="flex flex-col items-center justify-center gap-8 py-4x">
		<div class="flex flex-col items-center justify-center gap-2 text-center">
			<div class="text-4xl"><Logo /></div>
			<div class="text-xl">{data.app.title}</div>
		</div>

		{#if register_user}
			<Invitation name={register_user.name} />
		{:else if pair_invite}
			<Invitation name={pair_invite.name} />
		{/if}

		{#if data.error}
			<div class="text-red-600">{data.error}</div>
		{:else}
			<form
				class="mt-2x flex w-full flex-col items-center justify-center gap-4"
				method="POST"
				use:enhance={onsubmit}
			>
				{#if is_new_credential}
					<div class="w-full">
						<Input name="device_name" label="Identifiant de l’appareil" class="w-full" required />
					</div>
				{/if}
				<Button size="lg" class="flex items-center" type="submit" disabled={submitting}>
					<div class="-ml-1 flex size-5 items-center justify-center">
						{#if submitting}
							<Loader />
						{:else}
							<div class="icon-[ri--key-line] text-xl"></div>
						{/if}
					</div>
					Connexion
				</Button>
			</form>
		{/if}
	</div>

	<div class="flex justify-center">
		<div class="max-w-50 py-12 text-center">
			<AboutPasskeys />
		</div>
	</div>
</div> -->
