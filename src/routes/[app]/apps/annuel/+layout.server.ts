export async function load({ parent, locals: { pocketbase } }) {
	const { collections } = await parent();

	collections.projects.field_map.description.type = 'markdown';
	collections.projects.field_map.year.hidden = true;

	collections.students.field_map.year.hidden = true;
	collections.students.field_map.description.rows = 8;
	//collections.programs.fields

	const years = await pocketbase.collection('years').getFullList({ sort: '-id' });

	// const project_tags_map: Map<string, ProjectTagsRecord> = new Map(
	// 	project_tags.map((tag) => [tag.id, tag])
	// );
	// const programs_map: Map<string, ProgramsRecord> = new Map(
	// 	programs.map((program) => [program.id, program])
	// );

	const year = years[0].id;

	return {
		years,
		year,
		collections
	};
}
