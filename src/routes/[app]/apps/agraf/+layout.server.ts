import type { ProgramsRecord, ProjectTagsRecord, YearsRecord } from './types';

export async function load({ locals: { pocketbase, user } }) {
	const [years]: [YearsRecord[]] = await Promise.all([
		pocketbase.collection('years').getFullList<YearsRecord>({ sort: '-id' })
	]);

	const year = years[0].id;

	return {
		years,
		year
	};
}
