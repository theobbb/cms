// src/routes/api/admin/accept-draft/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { pocketbase }, fetch }) => {
	const { draft_id, collection } = await request.json();
	console.log('accepting draft');

	if (!draft_id || !collection) {
		throw error(400, 'Paramètres manquants');
	}

	try {
		// 1. Fetch the full draft record
		const draft = await pocketbase.collection(collection).getOne(draft_id);

		// SCENARIO A: No root record exists yet
		if (!draft.draft_of) {
			await pocketbase.collection(collection).update(draft.id, {
				draft: false,
				is_latest: true
			});
			return json({ success: true, message: 'Nouveau projet publié.' });
		}

		// SCENARIO B: Root record exists, we must merge
		const form_data = new FormData();
		form_data.append('draft', 'false');
		form_data.append('is_latest', 'true');

		// Loop through all properties of the draft
		for (const [key, value] of Object.entries(draft)) {
			const skip_fields = [
				'id',
				'created',
				'updated',
				'collectionId',
				'collectionName',
				'draft',
				'is_latest',
				'draft_of',
				'expand'
			];
			if (skip_fields.includes(key)) continue;

			// Handle file fields (images, videos, thumbnails)
			if (collection === 'projects' && (key === 'files' || key === 'thumbnail')) {
				const file_names = Array.isArray(value) ? value : value ? [value] : [];

				if (file_names.length === 0) {
					// FIX 2: Explicitly clear the file field to prevent "Ghost Files"
					form_data.append(key, '');
				} else {
					for (const file_name of file_names) {
						if (typeof file_name === 'string' && file_name !== '') {
							const res = await fetch(pocketbase.files.getURL(draft, file_name));
							if (!res.ok) throw new Error(`Failed to fetch file: ${file_name}`);

							const blob = await res.blob();
							// It will turn "my_image_sn1cvpsi4w_wnqeqgf84x.webp" back into "my_image.webp"
							const clean_file_name = file_name.replace(
								/(_[a-zA-Z0-9]{10})+(?=\.[a-zA-Z0-9]+$)/,
								''
							);
							form_data.append(key, blob, clean_file_name);
						}
					}
				}
			} else {
				if (key === 'meta_files') {
					// FIX: meta_files is an array of objects. We must stringify the entire array!
					form_data.append(key, JSON.stringify(value));
				} else if (key === 'socials') {
					// FIX: Hardcoded rule to stringify socials and prevent "[object Object]" corruption
					form_data.append(key, JSON.stringify(value));
				}
				// Handle standard text, relation, and JSON fields
				else if (Array.isArray(value)) {
					value.forEach((v) => form_data.append(key, v));
				} else if (typeof value === 'object' && value !== null) {
					// FIX 1: Safely stringify JSON to prevent the "[object Object]" corruption
					form_data.append(key, JSON.stringify(value));
				} else if (value !== null && value !== undefined) {
					form_data.append(key, value.toString());
				}
			}
		}

		// Update the root record with the new FormData payload
		await pocketbase.collection(collection).update(draft.draft_of, form_data);

		// Clean up by deleting the draft
		await pocketbase.collection(collection).delete(draft.id);

		return json({ success: true, message: 'Brouillon accepté et fusionné.' });
	} catch (err) {
		console.error('Draft acceptance failed:', err);
		throw error(500, 'Erreur lors de la validation du brouillon');
	}
};
