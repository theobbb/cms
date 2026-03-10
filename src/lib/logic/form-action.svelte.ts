import { dev } from '$app/environment';
import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
import { use_pocketbase } from '$lib/pocketbase';
import { ClientResponseError } from 'pocketbase';
import { getContext, setContext } from 'svelte';

export type FormError = { message?: string; code?: string };

export type FormActionContext = {
	form_data: FormData;
	cancel: () => void;
	canceled: () => boolean;
};

export class FormAction {
	toaster = use_toaster();
	pocketbase = use_pocketbase();

	errors: Record<string, FormError> = $state({});
	loading: boolean = $state(false);

	canceled = $state(false);

	private _hooks: Array<(ctx: FormActionContext) => Promise<void>> = [];

	register_hook(fn: (ctx: FormActionContext) => Promise<void>) {
		this._hooks.push(fn);
		return () => {
			this._hooks = this._hooks.filter((h) => h !== fn);
		};
	}

	clear_error(name: string) {
		delete this.errors[name];
	}

	submit(fn: (ctx: FormActionContext) => Promise<void>) {
		return async (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
			event.preventDefault();
			this.errors = {};
			this.loading = true;

			let _canceled = false;
			const ctx: FormActionContext = {
				form_data: new FormData(event.currentTarget, event.submitter),
				cancel: () => (_canceled = true),
				canceled: () => _canceled
			};

			try {
				await Promise.all(this._hooks.map((fn) => fn(ctx)));
				await fn(ctx);
			} catch (err) {
				if (dev) console.log(err);
				if (err instanceof ClientResponseError) {
					this.errors = err.response?.data ?? {};
					const first = Object.values(this.errors)[0];
					this.toaster.push('error', first?.message ?? err.message);
				} else {
					this.toaster.push('error');
				}
			} finally {
				this.loading = false;
			}
		};
	}
}

const FORM_ACTION_KEY = Symbol('FORM_ACTION_KEY');

export function init_form_action() {
	const formState = new FormAction();
	setContext(FORM_ACTION_KEY, formState);
	return formState;
}

export function use_form_action(): FormAction | null {
	return getContext<FormAction>(FORM_ACTION_KEY) ?? null;
}
