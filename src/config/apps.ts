export type App = { title: string; param: string; pocketbase: { url: string }; aliases?: string[] };

export const apps: Record<string, App> = {
	annuel: {
		title: 'Annuel de design',
		param: 'annuel',
		pocketbase: {
			url: 'https://admin.annuel-design.uqam.ca'
		}
	},
	agraf: {
		title: 'AGRAF',
		param: 'agraf',
		pocketbase: {
			url: 'https://api.agraf.xyz'
		},
		aliases: ['admin.agraf.xyz']
	}
};
