import type { Collection } from '$config/types';
import { process_collections } from '$config/utils';
import type {
	ProgramsRecord,
	ProjectsRecord,
	ProjectTagsRecord,
	SocialsRecord,
	YearsResponse
} from '$lib/pocketbase.types';

import type { StudentsRecord } from './types';

export const collections = {
	years: {
		title: 'Années',
		name: 'years',
		fields: [
			{
				key: 'id',
				title: 'année',
				type: 'string'
			}
		]
	} satisfies Collection<YearsResponse>,
	students: {
		title: 'Finissant-e-s',
		name: 'students',
		display_key: 'first_name+last_name',
		fields: [
			{
				key: 'last_name',
				title: 'nom',
				type: 'string'
			},
			{
				key: 'first_name',
				title: 'prénom',
				type: 'string'
			},
			{
				key: 'description',
				title: 'description',
				type: 'text'
			},
			{
				key: 'program',
				title: 'programme',
				type: 'relation',
				collection: 'programs'
			},
			{ key: 'scholarship', title: 'bourse', type: 'bool' }
		]
	} satisfies Collection<StudentsRecord>,
	projects: {
		title: 'Projets',
		name: 'projects',
		fields: [
			{
				key: 'name',
				title: 'nom',
				type: 'string'
			},
			{
				key: 'description',
				title: 'description',
				type: 'text'
			},
			{
				key: 'files',
				title: 'Medias',
				type: 'file',
				multiple: true
			},
			{
				key: 'students',
				title: 'Finissant-e-s',
				type: 'relation',
				collection: 'students',
				multiple: true
			},

			{
				key: 'tags',
				title: 'Catégories',
				type: 'relation',
				collection: 'project_tags',
				multiple: true
			}
		]
	} satisfies Collection<ProjectsRecord>,
	project_tags: {
		title: 'Catégories (projet)',
		name: 'project_tags',
		fields: [
			{
				key: 'name',
				title: 'nom',
				type: 'string'
			}
		]
	} satisfies Collection<ProjectTagsRecord>,
	programs: {
		title: 'Programmes',
		name: 'programs',
		fields: [
			{
				key: 'name',
				title: 'nom',
				type: 'string'
			},
			{
				key: 'description',
				title: 'description',
				type: 'text'
			}
		]
	} satisfies Collection<ProgramsRecord>,
	socials: {
		title: 'Liens',
		name: 'socials',
		fields: [
			{
				key: 'name',
				title: 'nom',
				type: 'string'
			},
			{
				key: 'url',
				title: 'url',
				type: 'url'
			}
		]
	} satisfies Collection<SocialsRecord>
};
