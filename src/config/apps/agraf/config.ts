import type { App } from '$config/types';
import { process_collections } from '$config/utils';
import collections from './collections.json';

export const agraf = {
	title: 'AGRAF',
	param: 'agraf',
	pocketbase: {
		url: 'https://api.agraf.xyz'
	}
	//collections: process_collections(collections)
} satisfies App;
