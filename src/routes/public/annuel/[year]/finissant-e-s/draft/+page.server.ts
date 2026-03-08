export async function load({ url, locals: { pocketbase } }) {
	const student_id = url.searchParams.get('id');

	if (student_id) {
		const student = await pocketbase
			.collection('students')
			.getOne(student_id, { expand: 'projects(students),program' });
		return { student };
	}

	return { student: null };
}
