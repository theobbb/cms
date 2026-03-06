import { json } from '@sveltejs/kit';

export async function GET({ url, params, locals: { super_pocketbase } }) {
	const id = url.searchParams.get('id');
	if (!id) return json({ success: false });

	const siblings = await super_pocketbase.collection('students').getFullList({
		filter: `year = "${params.year}" && (draft_of = "${id}" || id = "${id}")`
	});

	await Promise.all(
		siblings.map((s) => super_pocketbase.collection('students').update(s.id, { is_latest: false }))
	);

	return json({ success: true, total: siblings.length });
}
