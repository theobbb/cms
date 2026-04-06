<script>
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Warning from '$lib/ui/templates/flags/warning.svelte';

	const { name } = $props();

	const register_user = $derived(page.data.register);
	const pair_invite = $derived(page.data.pair);
</script>

<Box color="surface" class="my-4x w-full space-y-3x p-3x">
	<div class="text-center text-xl">Bienvenue, {name}.</div>

	<Warning>Connecte-toi depuis ton appareil principal (pas ton téléphone).</Warning>
</Box>
