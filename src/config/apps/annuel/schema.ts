import type { Schema } from '$config/types';
// import { process_schema } from '$config/utils';
import { collections } from './collections';

export const schema = [
	{
		name: 'Années',
		param: 'years',
		children: [
			{
				name: 'Années',
				param: 'years',

				children: [
					{
						name: 'Finissant-e-s',
						param: 'students',
						collection: collections.students,
						query: { filter: `year = "$params.year"`, expand: 'program' }
					},
					{
						name: 'Projets',
						param: 'projects',
						collection: collections.projects,
						query: { filter: `year = "$params.year"`, expand: 'program' }
					}
				]
			}
		]
	},
	{
		name: 'Programmes',
		param: 'programs',
		collection: collections.programs
	},
	{
		name: 'Catégories (projet)',
		param: 'project_tags',
		collection: collections.project_tags
	},
	{
		name: 'Liens (réseaux)',
		param: 'socials',
		collection: collections.socials
	},
	{
		name: 'Finissant-e-s',
		param: 'students',

		collection: collections.students,
		query: { expand: 'program' }
	},
	{
		name: 'Lien 1',
		param: 'link-1',

		children: [
			{
				name: 'Lien 1.1',
				param: 'link-1-1',

				children: [
					{
						name: 'Lien 1.1.1',
						param: 'link-1-1-1',

						collection: collections.students,
						query: { filter: 'year = $param.year', expand: 'program' }
					}
				]
			}
		]
	}
] satisfies Schema;
