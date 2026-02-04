import { agraf } from './apps/agraf/config';
import { annuel } from './apps/annuel/config';
import type { App } from './types';

export const apps: Record<string, App> = {
	annuel,
	agraf
};

// export const apps: Record<string, App> = {
// 	annuel: {
// 		title: 'Annuel de design',
// 		param: 'annuel',
// 		pocketbase: {
// 			url: 'https://api.annuel.3xw.ca'
// 		}
// 	},
// 	agraf: {
// 		title: 'AGRAF',
// 		param: 'agraf',
// 		pocketbase: {
// 			url: 'https://api.agraf.xyz'
// 		}
// 	}
// };
// export type App = {
// 	title: string;
// 	param?: string;
// 	pocketbase: {
// 		url: string;
// 	};
// };
