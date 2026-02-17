export async function load({ params, locals: { pocketbase }, depends }) {
	depends('data:student_draft');

	const student = await pocketbase
		.collection('students')
		.getOne(params.draft, { expand: 'projects(students)' });

	let draft;

	try {
		draft = await pocketbase
			.collection('student_drafts')
			.getOne(params.draft, { expand: 'projects(students)' });
	} catch (error) {}
	return { student, draft };
}
