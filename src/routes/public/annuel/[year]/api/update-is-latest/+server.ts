import { json } from '@sveltejs/kit';
// update-is-latest

export async function GET({ url, params, locals: { super_pocketbase } }) {
	const record_id = url.searchParams.get('id');
	const collection = url.searchParams.get('collection');
	if (!record_id || !collection) return json({ success: false });

	await super_pocketbase.collection(collection).update(record_id, {
		is_latest: false
	});

	return json({ success: true });
}
