export async function load({ url, locals: { pocketbase }, depends }) {
	depends('data:student_draft');

	const draft_id = url.searchParams.get('id');

	let student, draft;
	if (draft_id) {
		try {
			student = await pocketbase
				.collection('students')
				.getOne(draft_id, { expand: 'projects(students)' });
		} catch (error) {}

		try {
			draft = await pocketbase
				.collection('student_drafts')
				.getOne(draft_id, { expand: 'projects(students)' });
		} catch (error) {}
	}

	return { student, draft };
}
