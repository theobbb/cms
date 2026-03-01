<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';
	import FooterButtons from '$lib/ui/templates/footer-buttons.svelte';
	//import Select from '$lib/ui/pop/select.svelte';

	const dialog = new Pop();
</script>

<Button onclick={dialog.show}>Dialog</Button>
{#if dialog.open}
	<Dialog pop={dialog}>
		<div>ss</div>
		<div>
			<FooterButtons pop={dialog} action="Action" />
		</div>
	</Dialog>
{/if}
