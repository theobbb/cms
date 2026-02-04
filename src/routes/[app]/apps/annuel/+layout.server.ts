import type { ProgramsRecord, ProjectTagsRecord, YearsRecord } from './types';

export async function load({ locals: { pocketbase, user } }) {
	const [years, programs, project_tags]: [YearsRecord[], ProgramsRecord[], ProjectTagsRecord[]] =
		await Promise.all([
			pocketbase.collection('years').getFullList<YearsRecord>({ sort: '-id' }),
			pocketbase.collection('programs').getFullList<ProgramsRecord>({ sort: 'name' }),
			pocketbase.collection('project_tags').getFullList<ProjectTagsRecord>({ sort: '-name' })
		]);

	const project_tags_map: Map<string, ProjectTagsRecord> = new Map(
		project_tags.map((tag) => [tag.id, tag])
	);
	const programs_map: Map<string, ProgramsRecord> = new Map(
		programs.map((program) => [program.id, program])
	);

	const year = years[0].id;

	return {
		years,
		year,
		project_tags,
		project_tags_map,
		programs,
		programs_map
	};
}
