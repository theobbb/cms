export type App = {
	title: string;
	param: string;
	pocketbase: { url: string };
	aliases?: string[];
	lang?: 'fr' | 'en';
};

export const apps: Record<string, App> = {
	annuel: {
		title: 'Annuel de design',
		param: 'annuel',
		pocketbase: {
			url: 'https://api2.annuel.3xw.ca'
		},
		aliases: ['admin.annuel-design.uqam.ca']
	},
	agraf: {
		title: 'AGRAF',
		param: 'agraf',
		pocketbase: {
			url: 'https://api.agraf.xyz'
		},
		aliases: ['admin.agraf.xyz']
	},
	yuki: {
		title: 'Yuki',
		param: 'yuki',
		pocketbase: {
			url: 'https://api.yuki.3xw.ca'
		},
		aliases: ['atelier.yukitoshi.art']
	},
	lexpol: {
		title: 'LexPol',
		param: 'lexpol',
		pocketbase: {
			url: 'https://api.lexpol.3xw.ca'
		}
	}
};
