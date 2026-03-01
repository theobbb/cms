// confirm.svelte.ts

import type { ButtonVariant } from '$lib/ui/button.svelte';
import { Pop } from '$lib/ui/pop/pop-context.svelte';

class DialogConfirm extends Pop {
	message = $state('');
	variant: ButtonVariant = $state('danger');
	resolve: (value: boolean) => void = () => {};
}

export const dialog_confirm = new DialogConfirm();

export async function confirm(
	message: string,
	variant: ButtonVariant = 'danger'
): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		dialog_confirm.message = message;
		dialog_confirm.variant = variant;
		dialog_confirm.resolve = resolve;
		dialog_confirm.show();
	});
}
