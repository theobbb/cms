<script>
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Info from '$lib/ui/templates/box/info.svelte';
	import Warning from '$lib/ui/templates/box/warning.svelte';

	const { name } = $props();

	const register_user = $derived(page.data.register);
	const pair_invite = $derived(page.data.pair);

	const steps = [
		`Clique sur "Connexion"`,
		`Utilise ton emprunte digitale, visage ou PIN pour enregistrer ton accès`,
		`Et voilà ! Les futures connexions seront instantanées`
	];
</script>

<Box color="surface" class="w-full px-4 py-3">
	<div class="mb-4 flex items-start">
		<div class="flex-1 text-center">
			<div class="flex items-center justify-center gap-1.5">
				<span class="icon-[ri--user-line]"></span>
				<div>{name}</div>
			</div>
			<div class="mt-2">Tu as reçu une invitation !</div>
		</div>
	</div>
	<Warning>
		Assure-toi d'être sur l'appareil où tu utiliseras l'application — ton accès (passkey) sera créé
		sur cet appareil.
	</Warning>
	<!-- <Box color="blue">
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
	</Box> -->
</Box>
