<script>
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';

	const { name } = $props();

	const register_user = $derived(page.data.register);
	const pair_invite = $derived(page.data.pair);

	const steps = [
		`Clique sur "Connexion"`,
		`Utilise ton emprunte digitale, visage ou PIN pour enregistrer ton accès`,
		`Et voilà ! Les futures connexions seront instantanées`
	];
</script>

<div class="w-full">
	<div class="mb-4 flex items-start">
		<div class=" flex-1">
			<div class="flex items-center gap-1.5">
				<span class="icon-[ri--user-line]"></span>
				<div>{name}</div>
			</div>
			<div class="mb-2 text-lg">
				Tu es invité(e) à rejoindre l'application
				<span class="underline"> {page.data.app.title}</span> !
			</div>
			<div class="space-y-2 text-sm">
				<p class="flex items-center gap-1.5">
					<span class="icon-[ri--information-line]"></span>
					<span
						>This invitation link works <strong>one time only</strong> to set up your passkey.</span
					>
				</p>
			</div>
		</div>
	</div>

	<Box color="blue">
		<div class="px-4 py-3 text-sm">
			<div>
				<div>Fonctionnement:</div>
				<div class="space-y-1">
					{#each steps as step, i}
						<div class="flex gap-2">
							<div
								class="flex size-4 translate-y-0.5 items-center justify-center rounded-full bg-black/10"
							>
								<span class="text-xs">{i + 1}</span>
							</div>
							<div>{step}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</Box>
	<div class="text-center">
		Ce système d’authentification utilise les <span class="font-semibold">passkeys</span>.
		<a class="text-indigo-600" href="/help/passkeys">en savoir plus →</a>
	</div>
</div>
