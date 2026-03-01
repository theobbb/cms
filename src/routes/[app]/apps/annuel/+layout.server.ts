export async function load({ parent, locals: { pocketbase } }) {
	const { collections } = await parent();

	// collections.projects.field_map.description.type = 'markdown';
	// collections.projects.field_map.year.hidden = true;

	// collections.students.field_map.year.hidden = true;
	// collections.students.field_map.description.rows = 8;

	const years = await pocketbase.collection('years').getFullList({ sort: '-id' });

	return {
		years,

		collections
	};
}
