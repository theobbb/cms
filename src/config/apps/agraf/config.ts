import type { App } from '$config/types';
import { process_collections } from '$config/utils';
import { collections } from './collections';
import { schema } from './schema';
import collections2 from './test.json';

export const agraf = {
	title: 'AGRAF',
	param: 'agraf',
	pocketbase: {
		url: 'https://api.agraf.xyz'
	},

	collections,
	collections2: process_collections(collections2)
} satisfies App;
