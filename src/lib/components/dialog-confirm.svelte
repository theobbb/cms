<script lang="ts">
	import { dialog_confirm } from '$lib/logic/confirm.svelte';
	import Button from '$lib/ui/button.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';

	function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		dialog_confirm.resolve(true);
		dialog_confirm.open = false;
	}

	function cancel() {
		dialog_confirm.resolve(false);
		dialog_confirm.open = false;
	}
</script>

{#if dialog_confirm.open}
	<Dialog onclose={cancel}>
		<form class="max-w-md space-y-5 pb-2" {onsubmit}>
			<div class="mt-1 border-b px-2 pb-5 text-lg">
				{dialog_confirm.message}
			</div>
			<div class="flex justify-end gap-2">
				<Button size="lg" variant="ghost" onclick={cancel}>Non</Button>
				<Button size="lg" autofocus variant="danger" type="submit">Oui</Button>
			</div>
		</form>
	</Dialog>
{/if}
