import { confirm } from '$lib/logic/confirm.svelte';
import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';

export class FormDraft {
	// Expose the restored data so the UI can bind to it
	restored_data: Record<string, any> | null = $state(null);

	#debounce_timer?: ReturnType<typeof setTimeout>;
	#toaster = use_toaster();
	#key_getter: () => string | null;

	constructor(key_getter: () => string | null) {
		this.#key_getter = key_getter;

		// Automatically react to key changes (e.g., opening a new record in the CMS)
		$effect(() => {
			const key = this.#key_getter();
			if (key) {
				// Reset memory state for safety
				this.restored_data = null;
				this.#check_and_prompt(key);
			}
		});
	}

	async #check_and_prompt(key: string) {
		const saved_str = localStorage.getItem(key);
		if (!saved_str) return;

		const confirmed = await confirm(
			'Un brouillon non sauvegardé existe. Voulez-vous le restaurer ?'
		);

		if (confirmed) {
			try {
				this.restored_data = JSON.parse(saved_str);
				this.#toaster.push('info', 'Brouillon restauré');
			} catch (e) {
				// Failsafe if JSON is malformed
				this.clear();
			}
		} else {
			this.clear();
		}
	}

	// Used directly on the <form oninput={...}>
	handle_input = (event: Event) => {
		console.log(event);
		return;
		const key = this.#key_getter();
		if (!key) return;

		clearTimeout(this.#debounce_timer);
		this.#debounce_timer = setTimeout(() => {
			const form = event.currentTarget as HTMLFormElement;
			const fd = new FormData(form);
			const data: Record<string, any> = {};

			for (const [k, v] of fd.entries()) {
				// Ignore complex objects like File
				if (v instanceof File) continue;
				data[k] = v;
			}

			localStorage.setItem(key, JSON.stringify(data));
		}, 750);
	};

	clear() {
		this.restored_data = null;
		const key = this.#key_getter();
		if (key) localStorage.removeItem(key);
	}
}
