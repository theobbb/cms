export async function load({ parent, locals: { pocketbase } }) {
	const { collections } = await parent();

	// collections.projects.field_map.description.type = 'markdown';
	// collections.projects.field_map.year.hidden = true;

	// collections.students.field_map.year.hidden = true;
	// collections.students.field_map.description.rows = 8;

	// collections.students.field_map.first_name.label = 'prénom';
	// collections.students.field_map.last_name.label = 'nom';
	// collections.students.field_map.program.label = 'programme';
	// collections.students.field_map.scholarship.label = 'bourse';
	// collections.students.field_map.socials.label = 'liens';

	const years = await pocketbase.collection('years').getFullList({ sort: '-id' });

	return {
		years,

		collections
	};
}
