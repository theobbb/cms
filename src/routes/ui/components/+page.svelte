<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import ConfirmCancel from '$lib/ui/templates/confirm-cancel.svelte';
	import Anchor from '$lib/ui/components/pop/anchor.svelte';
	import Tooltip from '$lib/ui/components/pop/tooltip.svelte';
	import DropdownMenu from '$lib/ui/components/pop/dropdown-menu/dropdown-menu.svelte';

	import Select from '$lib/ui/components/pop/select/select.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import DialogDescription from '$lib/ui/components/pop/dialog/dialog-description.svelte';
	import { use_toaster, type ToastType } from '$lib/components/toaster/toaster-context.svelte';

	const toaster = use_toaster();
	const toast_types: ToastType[] = ['loading', 'info', 'success', 'warning', 'error'];
	const dialog = new Pop();

	let select_value = $state('');
</script>

<div class="space-y-8">
	<div>
		<Button onclick={dialog.show} tooltip="Ceci est un dialog">Dialog</Button>

		<Dialog pop={dialog}>
			<DialogHeader>
				<DialogTitle>Ceci est un dialog</DialogTitle>
				<DialogDescription>Ceci est une description</DialogDescription>
			</DialogHeader>

			<div>
				<ConfirmCancel confirm="Action" />
			</div>
		</Dialog>
	</div>

	<!-- <DropdownMenu options={[{ name: 'Option 1', action: () => {} }]} /> -->

	<div>
		<Select
			bind:value={select_value}
			options={[
				{ label: 'options1', value: '1' },
				{ label: 'options2', value: '2' },
				{ label: 'options3', value: '3' }
			]}
		/>
	</div>

	<div class="space-y-2">
		{#each toast_types as toast_type}
			<div>
				<Button onclick={() => toaster.push(toast_type)}>{toast_type}</Button>
			</div>
		{/each}
	</div>
</div>
