export type App = { title: string; param: string; pocketbase: { url: string } };

export const apps = {
	annuel: {
		title: 'Annuel de design',
		param: 'annuel',
		pocketbase: {
			url: 'https://api.annuel.3xw.ca'
		}
	},
	agraf: {
		title: 'AGRAF',
		param: 'agraf',
		pocketbase: {
			url: 'https://api.agraf.xyz'
		}
	}
} satisfies Record<string, App>;

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
