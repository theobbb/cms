<script lang="ts">
	import Dialog from '$lib/ui/pop/dialog.svelte';

	const { pop } = $props();
</script>

<Dialog {pop}>
	<div>
		<div>Connecter un autre appareil</div>
		<div>Ce système d'authentification utilise les <span>passkeys</span></div>
		<div><a href="/help/passkeys">en savoir plus</a></div>
	</div>

	<div></div>
</Dialog>
