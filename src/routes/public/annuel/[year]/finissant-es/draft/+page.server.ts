// export async function load({ url, locals: { pocketbase }, depends }) {
// 	depends('data:draft');
// 	const record_id = url.searchParams.get('id');

// 	if (record_id) {
// 		const student = await pocketbase
// 			.collection('students')
// 			.getOne(record_id, { expand: 'projects(students),program' });
// 		return { student };
// 	}

// 	return { student: null };
// }
