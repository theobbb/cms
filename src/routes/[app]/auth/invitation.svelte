<script>
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Info from '$lib/ui/templates/box/info.svelte';
	import Warning from '$lib/ui/templates/box/warning.svelte';

	const { name } = $props();

	const register_user = $derived(page.data.register);
	const pair_invite = $derived(page.data.pair);
</script>

<Box color="surface" class="my-12 w-full p-3">
	<div class="mb-4 flex items-start">
		<div class="flex-1 text-center">
			<div class="mt-2 text-xl">Bienvenue, {name}.</div>
		</div>
	</div>
	<Warning>Connecte-toi depuis ton appareil principal (pas ton téléphone).</Warning>
</Box>
