<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import FooterButtons from '$lib/ui/templates/confirm-cancel.svelte';
	import Anchor from '$lib/ui/components/pop/anchor.svelte';
	import Tooltip from '$lib/ui/components/tooltip.svelte';
	import DropdownMenu from '$lib/ui/components/pop/dropdown-menu/dropdown-menu.svelte';

	import Select from '$lib/ui/components/pop/select/select.svelte';

	const dialog = new Pop();

	let select_value = $state('');
</script>

<Button onclick={dialog.show} tooltip="Ceci est un dialog">Dialog</Button>

<Dialog pop={dialog}>
	<div>ss</div>
	<div>
		<FooterButtons action="Action" />
	</div>
</Dialog>

<!-- <DropdownMenu options={[{ name: 'Option 1', action: () => {} }]} /> -->

<Select
	bind:value={select_value}
	options={[
		{ label: 'options1', value: '1' },
		{ label: 'options2', value: '2' },
		{ label: 'options3', value: '3' }
	]}
/>
