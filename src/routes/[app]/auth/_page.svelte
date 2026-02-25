<script lang="ts">
	import { enhance } from '$app/forms';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';

	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	const { data } = $props();

	const toaster = use_toaster();

	const onsubmit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'failure') {
				toaster.push('error', (result.data?.message as string) || 'Erreur inconnue');
			}
			if (result.type === 'redirect') {
				toaster.push('success', 'Bienvenue !');
			}
			update();
		};
	};
</script>

<div class="">
	<div class="mx-auto my-24 flex max-w-2xs flex-col items-center gap-gap-y">
		<div class="text-xl">{data.app.title}</div>

		<form method="POST" action="?/signin" class="w-full space-y-3" use:enhance={onsubmit}>
			<div>
				<Input class="w-full" name="email" type="email" label="Email" required />
			</div>
			<div>
				<Input class="w-full" name="password" type="password" label="Password" required />
			</div>
			<div><Button size="lg" class="w-full" type="submit">Connexion</Button></div>
		</form>
	</div>
</div>
