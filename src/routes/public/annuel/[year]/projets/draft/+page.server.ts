import type { RecordModel } from 'pocketbase';

export async function load({ url, locals: { pocketbase }, depends }) {
	depends('data:project_draft');

	const draft_id = url.searchParams.get('id');

	let draft: RecordModel | null = null;
	let project: RecordModel | null = null;

	if (draft_id) {
		try {
			project = await pocketbase.collection('projects').getOne(draft_id, { expand: 'students' });
		} catch (error) {}
		try {
			project = await pocketbase.collection('projects').getOne(draft_id, { expand: 'students' });
		} catch (error) {}
	}

	return { project, draft };
}
