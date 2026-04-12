import { json } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

type DraftRecord =
	| (RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean })
	| null;

export async function POST({ url, request, locals: { super_pocketbase }, fetch }) {
	const collection = url.searchParams.get('collection');
	const expand = url.searchParams.get('expand');
	if (!collection) return json({ success: false }, { status: 400 });

	const pb_options = expand ? { expand } : {};

	try {
		// 1. Detect payload type and parse
		const isJson = request.headers.get('content-type')?.includes('application/json');
		const body = isJson ? await request.json() : await request.formData();

		// 2. Normalize body into a clean FormData object for PocketBase
		// This makes it easy to inject copied files later
		const pbPayload = new FormData();

		const appendToPayload = (key: string, value: any) => {
			if (value !== undefined && value !== null) {
				pbPayload.append(key, value);
			}
		};

		if (isJson) {
			Object.entries(body).forEach(([k, v]) => appendToPayload(k, v));
		} else {
			for (const [key, value] of body.entries()) {
				appendToPayload(key, value);
			}
		}

		// --- NEW: Extract retained files arrays and remove them from PocketBase payload ---
		const retainedFilesStr = pbPayload.get('retained_files')?.toString();
		const retainedFiles: string[] | null = retainedFilesStr ? JSON.parse(retainedFilesStr) : null;
		pbPayload.delete('retained_files');

		const retainedThumbnailsStr = pbPayload.get('retained_thumbnails')?.toString();
		const retainedThumbnails: string[] | null = retainedThumbnailsStr
			? JSON.parse(retainedThumbnailsStr)
			: null;
		pbPayload.delete('retained_thumbnails');
		// ----------------------------------------------------------------------------------

		const id = pbPayload.get('id')?.toString();
		const draft_of = pbPayload.get('draft_of')?.toString();

		let new_record: DraftRecord;

		// --- Scenario A: Checking/Creating a Draft of an existing record ---
		if (!id && draft_of) {
			const existing_draft = await super_pocketbase
				.collection(collection)
				.getFirstListItem(`draft_of="${draft_of}" && draft=true`)
				.catch(() => null);

			if (existing_draft) {
				// Draft already exists, just update it with text data
				new_record = await super_pocketbase
					.collection(collection)
					.update(existing_draft.id, pbPayload, pb_options);
			} else {
				const original_record = await super_pocketbase.collection(collection).getOne(draft_of);

				// Helper to fetch files from original record and append as blobs
				const duplicateFiles = async (fieldName: string, retainedNames: string[] | null) => {
					const fileNames = original_record[fieldName];
					if (!fileNames) return;

					const names = Array.isArray(fileNames) ? fileNames : [fileNames];

					for (const fileName of names) {
						if (!fileName) continue;

						// Skip duplication if the client removed this file from the UI
						if (retainedNames !== null && !retainedNames.includes(fileName)) {
							continue;
						}

						const fileUrl = super_pocketbase.files.getURL(original_record, fileName);

						try {
							const response = await fetch(fileUrl);
							if (response.ok) {
								const blob = await response.blob();
								pbPayload.append(fieldName, blob, fileName);
							}
						} catch (e) {
							console.error(`[Draft Creation] Failed to copy file ${fileName}:`, e);
						}
					}
				};
				await duplicateFiles('files', retainedFiles);
				await duplicateFiles('thumbnail', retainedThumbnails);

				// Create the new record with the duplicated files
				new_record = await super_pocketbase.collection(collection).create(pbPayload, pb_options);

				// Demote original record
				await super_pocketbase.collection(collection).update(draft_of, {
					is_latest: false
				});
			}
		}
		// --- Scenario B: Updating an explicit record (id exists) ---
		else if (id) {
			new_record = await super_pocketbase.collection(collection).update(id, pbPayload, pb_options);
		}
		// --- Scenario C: Creating a brand new record (no draft_of) ---
		else {
			new_record = await super_pocketbase.collection(collection).create(pbPayload, pb_options);
		}

		return json(new_record);
	} catch (err: any) {
		console.error('[API Draft Error]', err);

		const error_payload = err.response || {
			data: {},
			message: err.message || 'Une erreur est survenue'
		};

		return json(error_payload, {
			status: err.status || 500
		});
	}
}
