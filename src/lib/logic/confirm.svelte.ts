export type DialogConfirm = {
	open: boolean;
	message: string;
	resolve: (value: boolean) => void;
};

export const dialog_confirm = $state<DialogConfirm>({
	open: false,
	message: '',
	resolve: () => {}
});

export async function confirm(message: string): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		dialog_confirm.open = true;
		dialog_confirm.message = message;
		dialog_confirm.resolve = resolve;
	});
}
