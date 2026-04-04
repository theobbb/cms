export async function load({ url, locals: { pocketbase }, depends }) {
	depends('data:draft');

	const project_id = url.searchParams.get('id');

	if (project_id) {
		const project = await pocketbase
			.collection('projects')
			.getOne(project_id, { expand: 'students' });
		return { project };
	}

	return { project: null };
}
