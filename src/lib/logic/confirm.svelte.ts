// confirm.svelte.ts

import { Pop } from '$lib/ui/pop/pop-context.svelte';

class DialogConfirm extends Pop {
	message = $state('');
	resolve: (value: boolean) => void = () => {};
}

export const dialog_confirm = new DialogConfirm();

export async function confirm(message: string): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		dialog_confirm.message = message;
		dialog_confirm.resolve = resolve;
		dialog_confirm.show();
	});
}
