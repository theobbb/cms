import type { ProjectDraftsRecord, ProjectsRecord } from '$lib/pocketbase.types';

export async function load({ locals: { pocketbase }, params }) {
	const project: ProjectsRecord = await pocketbase
		.collection('projects')
		.getOne(params.draft, { filter: `year = "${params.year}"` });

	let draft: ProjectDraftsRecord | null = null;
	try {
		draft = await pocketbase.collection('project_drafts').getOne(params.draft);
	} catch (error) {}

	return { project, draft };
}
