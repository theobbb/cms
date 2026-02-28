<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import FooterButtons from '$lib/ui/form/components/footer-buttons.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';
	//import Select from '$lib/ui/pop/select.svelte';

	const dialog = new Pop();
</script>

<Button onclick={dialog.show}>Dialog</Button>
{#if dialog.open}
	<Dialog pop={dialog}>
		<div>ss</div>
		<div>
			<FooterButtons action="Action" />
		</div>
	</Dialog>
{/if}
