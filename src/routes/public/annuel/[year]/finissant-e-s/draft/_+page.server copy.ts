export async function load({ url, locals: { pocketbase }, depends }) {
	depends('data:students');

	const draft_id = url.searchParams.get('id');

	let student, draft;
	if (draft_id) {
		try {
			student = await pocketbase
				.collection('students')
				.getOne(draft_id, { expand: 'projects(students),program' });
		} catch (error) {}

		try {
			draft = await pocketbase.collection('drafts').getOne(draft_id);
		} catch (error) {}
	}

	return { student, draft };
}
