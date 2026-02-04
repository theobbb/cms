import type { Schema } from '$config/types';

import { collections } from './collections';

export const schema = [
	{
		name: 'Affiches',
		param: 'posters',
		type: 'link',
		children: [
			{
				title: 'Années',
				type: 'table',
				collection: collections.posters
			}
		]
	}
] satisfies Schema;
