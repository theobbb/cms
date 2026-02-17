import { apps } from '$config/apps';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';

export async function load({ params, locals: { pocketbase }, depends }) {
	depends('data:project_draft');
	// const super_pocketbase = await super_auth_pocketbase(apps.annuel.pocketbase.url);
	// const collection = await super_pocketbase.collections.getFirstListItem('name = "projects"');

	// collection.fields = collection.fields.filter(
	// 	(field) => !field.hidden && field.name != 'id' && field.name != 'emailVisibility'
	// );
	// collection.field_map = Object.fromEntries(collection.fields.map((field) => [field.name, field]));

	// const project = await pocketbase
	// 	.collection('projects')
	// 	.getOne(params.draft, { expand: 'students' });

	let draft;
	let project;

	try {
		project = await pocketbase.collection('projects').getOne(params.draft, { expand: 'students' });

		draft = await pocketbase
			.collection('project_drafts')
			.getOne(params.draft, { expand: 'students' });
	} catch (error) {}
	console.log(draft, project);
	return { project, draft };
}
