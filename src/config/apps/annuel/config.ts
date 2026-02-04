import type { App } from '$config/types';
import { collections } from './collections';

export const annuel = {
	title: 'Annuel de design',
	param: 'annuel',
	pocketbase: {
		url: 'https://api.annuel.3xw.ca'
	},

	collections
} satisfies App;
