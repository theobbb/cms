import { json } from '@sveltejs/kit';

export async function GET({ url, params, locals: { super_pocketbase } }) {
	const record_id = url.searchParams.get('id');
	const collection = url.searchParams.get('collection');
	if (!record_id || !collection) return json({ success: false });

	await super_pocketbase.collection(collection).update(record_id, {
		is_latest: false
	});
	// await super_pocketbase.collection(collection).update({
	// 	filter: `year = "${params.year}" && (draft_of = "${id}" || id = "${id}")`
	// });
	// const siblings = await super_pocketbase.collection(collection).getFullList({
	// 	filter: `year = "${params.year}" && (draft_of = "${id}" || id = "${id}")`
	// });

	// await Promise.all(
	// 	siblings.map((s) => super_pocketbase.collection(collection).update(s.id, { is_latest: false }))
	// );

	return json({ success: true });
}
