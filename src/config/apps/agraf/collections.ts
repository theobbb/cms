import type { Collection } from '$config/types';
import type { PostersRecord } from './types';

export const collections = {
	posters: {
		title: 'Affiches',
		name: 'posters',
		fields: [
			{
				key: 'images',
				title: 'images',
				type: 'file',
				multiple: true
			},
			{
				key: 'title',
				title: 'titre',
				type: 'string'
			},
			{
				key: 'body',
				title: 'description',
				type: 'markdown'
			},
			{
				key: 'slug',
				title: 'slug',
				type: 'slug',
				generate: {
					key: 'title'
				}
			},
			{
				key: 'date',
				title: 'date',
				type: 'date'
			}
		]
	} satisfies Collection<PostersRecord>
};
