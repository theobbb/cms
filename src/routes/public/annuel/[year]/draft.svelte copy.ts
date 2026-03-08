// $lib/logic/draft.svelte.ts
import { use_pocketbase } from '$lib/pocketbase';
import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
import { goto, invalidate } from '$app/navigation';
import { page } from '$app/state';
import type { RecordModel } from 'pocketbase';

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

	async on_submit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
		context: {
			draft: RecordModel | undefined;
			record: RecordModel | undefined;
			process_data?: (formData: FormData) => void | Promise<void>;
			on_success?: (new_id?: string) => void | Promise<void>;
		}
	) {
		event.preventDefault();
		const form_data = new FormData(event.currentTarget, event.submitter);

		const { draft, record } = context;
		console.log('submitting', context, form_data);

		const virgin = !draft && !record;
		try {
			// 1. Run custom data processing (serializing JSON fields, etc)
			if (context.process_data) {
				await context.process_data(form_data);
			}

			let result_id;

			const draft_data = Object.fromEntries(form_data);
			const data = { data: draft_data, collection: this.config.collection };

			// 2. PocketBase Logic
			if (draft) {
				// A. Update existing draft
				await this.pocketbase.collection('drafts').update(draft.id, data);
			} else {
				// B. Create new draft
				// If we are editing an existing live record, we MUST set the ID manually
				// so PocketBase knows which record this draft belongs to.

				if (!virgin && record) {
					data.id = record.id;
				}

				const new_draft = await this.pocketbase.collection('drafts').create(data);

				result_id = new_draft.id;
			}

			// 3. Success Feedback
			this.toaster.push('success', 'Merci!');
			await invalidate(this.config.invalidate_key);

			if (virgin && result_id) {
				goto(`${page.url.pathname}?id=${result_id}`);
			}

			if (context.on_success) {
				await context.on_success(result_id);
			}
		} catch (err) {
			console.error(err);
			this.toaster.push('error', 'Une erreur est survenue');
		}
	}
}
