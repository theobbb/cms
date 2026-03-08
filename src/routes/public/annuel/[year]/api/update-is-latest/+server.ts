import { json } from '@sveltejs/kit';

export async function GET({ url, params, locals: { super_pocketbase } }) {
	const id = url.searchParams.get('id');
	const collection = url.searchParams.get('collection');
	if (!id || !collection) return json({ success: false });

	const siblings = await super_pocketbase.collection(collection).getFullList({
		filter: `year = "${params.year}" && (draft_of = "${id}" || id = "${id}")`
	});

	await Promise.all(
		siblings.map((s) => super_pocketbase.collection(collection).update(s.id, { is_latest: false }))
	);

	return json({ success: true, total: siblings.length });
}
