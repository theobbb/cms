import { collections } from './_collections';
import type { App } from '$config/types';

export const annuel = {
	title: 'Annuel de design',
	param: 'annuel',
	pocketbase: {
		url: 'https://api.annuel.3xw.ca'
	}

	//collections: process_collections(collections)
} satisfies App;

function process_collections() {
	return collections;
}

// const collections
