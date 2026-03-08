<script lang="ts">
	import { dialog_confirm } from '$lib/logic/confirm.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import PopConfirmCancel from './pop-confirm-cancel.svelte';
	import DialogHeader from '../components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '../components/pop/dialog/dialog-title.svelte';
	import ConfirmCancel from './confirm-cancel.svelte';

	function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		dialog_confirm.resolve(true);
		dialog_confirm.close();
	}
	function cancel() {
		dialog_confirm.resolve(false);
		dialog_confirm.close();
	}
</script>

<form class="contents" {onsubmit}>
	<Dialog pop={dialog_confirm}>
		<DialogHeader>
			<DialogTitle>{dialog_confirm.message}</DialogTitle>
		</DialogHeader>
		<div class="border-b"></div>
		<ConfirmCancel onclose={cancel} variant={dialog_confirm.variant} />

		<!-- <div class="flex justify-end gap-2">
				<Button size="lg" variant="ghost" type="reset" onclick={cancel}>Non</Button>
				<Button size="lg" autofocus variant={dialog_confirm.variant} type="submit">Oui</Button>
			</div> -->
	</Dialog>
</form>
