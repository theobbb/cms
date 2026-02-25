// $lib/logic/draft.svelte.ts
import { use_pocketbase } from '$lib/pocketbase';
import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
import { invalidate } from '$app/navigation';

type DraftConfig = {
	collection: string; // e.g. 'project_drafts'
	invalidate_key: string; // e.g. 'data:project_draft'
};

export class DraftManager {
	pocketbase = use_pocketbase();
	toaster = use_toaster();
	config: DraftConfig;

	constructor(config: DraftConfig) {
		this.config = config;
	}

	async handle_submit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
		context: {
			draft_id?: string;
			live_record_id?: string; // The ID of the published record (if it exists)
			is_new_creation?: boolean; // Corresponds to 'virgin' (creating from scratch)
			process_data?: (formData: FormData) => void | Promise<void>;
			on_success?: (new_id?: string) => void | Promise<void>;
		}
	) {
		event.preventDefault();
		const form_data = new FormData(event.currentTarget, event.submitter);

		try {
			// 1. Run custom data processing (serializing JSON fields, etc)
			if (context.process_data) {
				await context.process_data(form_data);
			}

			let result_id;

			// 2. PocketBase Logic
			if (context.draft_id) {
				// A. Update existing draft
				await this.pocketbase
					.collection(this.config.collection)
					.update(context.draft_id, form_data);
			} else {
				// B. Create new draft
				// If we are editing an existing live record, we MUST set the ID manually
				// so PocketBase knows which record this draft belongs to.
				if (!context.is_new_creation && context.live_record_id) {
					form_data.set('id', context.live_record_id);
				}

				const new_draft = await this.pocketbase
					.collection(this.config.collection)
					.create(form_data);

				result_id = new_draft.id;
			}

			// 3. Success Feedback
			this.toaster.push('success', 'Merci!');
			await invalidate(this.config.invalidate_key);

			if (context.on_success) {
				await context.on_success(result_id);
			}
		} catch (err) {
			console.error(err);
			this.toaster.push('error', 'Une erreur est survenue');
		}
	}
}
