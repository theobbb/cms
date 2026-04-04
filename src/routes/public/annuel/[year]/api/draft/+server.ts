import { json } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

type DraftRecord =
	| (RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean })
	| null;

export async function POST({ url, request, locals: { super_pocketbase } }) {
	const body = await request.json();

	const collection = url.searchParams.get('collection');
	if (!collection) return json({ success: false });

	try {
		let new_record: DraftRecord;

		// In your POST API endpoint:
		if (!body.id && body.draft_of) {
			// Before creating, verify a draft doesn't already exist for this live record
			const existing_draft = await super_pocketbase
				.collection(collection)
				.getFirstListItem(`draft_of="${body.draft_of}" && draft=true`)
				.catch(() => null); // getFirstListItem throws 404 if nothing is found

			if (existing_draft) {
				// Prevent duplicate drafts! Update the existing one instead.
				new_record = await super_pocketbase.collection(collection).update(existing_draft.id, body);
				return json(new_record);
			}
		}

		if (body.id) {
			// Draft exists. Just update it.
			new_record = await super_pocketbase.collection(collection).update(body.id, body);
		} else {
			// New draft
			// Mark the Live record as no longer the 'latest' version
			if (body.draft_of)
				await super_pocketbase.collection(collection).update(body.draft_of, {
					is_latest: false
				});

			// 2. Create the single draft record
			new_record = await super_pocketbase.collection(collection).create(body);
		}

		return json(new_record);
	} catch (err: any) {
		const error_payload = err.response || {
			data: {},
			message: err.message || 'Une erreur est survenue'
		};

		return json(error_payload, {
			status: err.status || 500
		});
	}
}
