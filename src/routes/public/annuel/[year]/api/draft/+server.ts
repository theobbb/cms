import { json } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

type DraftRecord =
	| (RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean })
	| null;

export async function POST({ url, request, locals: { super_pocketbase } }) {
	const collection = url.searchParams.get('collection');
	if (!collection) return json({ success: false }, { status: 400 });

	try {
		let new_record: DraftRecord;

		// 1. Detect payload type
		const isJson = request.headers.get('content-type')?.includes('application/json');

		// 2. Parse body (PocketBase accepts both JS Objects and FormData!)
		const body = isJson ? await request.json() : await request.formData();

		// 3. Helper to extract keys safely whether it's JSON or FormData
		const id = isJson ? body.id : body.get('id');
		const draft_of = isJson ? body.draft_of : body.get('draft_of');

		// Prevent duplicate drafts
		if (!id && draft_of) {
			const existing_draft = await super_pocketbase
				.collection(collection)
				.getFirstListItem(`draft_of="${draft_of}" && draft=true`)
				.catch(() => null);

			if (existing_draft) {
				new_record = await super_pocketbase.collection(collection).update(existing_draft.id, body);
				return json(new_record);
			}
		}

		if (id) {
			// Draft exists. Just update it.
			new_record = await super_pocketbase.collection(collection).update(id as string, body);
		} else {
			// New draft
			if (draft_of) {
				await super_pocketbase.collection(collection).update(draft_of as string, {
					is_latest: false
				});
			}

			// Create the single draft record (Files will automatically upload if body is FormData)
			new_record = await super_pocketbase.collection(collection).create(body);
		}

		return json(new_record);
	} catch (err: any) {
		// Forward the PocketBase validation error back to the client
		const error_payload = err.response || {
			data: {},
			message: err.message || 'Une erreur est survenue'
		};

		return json(error_payload, {
			status: err.status || 500
		});
	}
}
