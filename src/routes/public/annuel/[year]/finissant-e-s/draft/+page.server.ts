export async function load({ url, locals: { pocketbase } }) {
	//depends('data:students');

	const student_id = url.searchParams.get('id');

	console.log(student_id);
	if (student_id) {
		const student = await pocketbase
			.collection('students')
			.getOne(student_id, { expand: 'projects(students),program' });
		return { student };
	}

	return { student: null };
}
