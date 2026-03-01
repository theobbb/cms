import { process_collections } from '$config/utils';
import { super_auth_pocketbase } from '$lib/server/super-pocketbase';

export async function load({ locals: { app, pocketbase, super_pocketbase, user, public_route } }) {
	//const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);

	const collections = await super_pocketbase.collections.getFullList({
		filter: 'system = false',
		fields: 'id,fields,name,updateRule,viewRule,createRule,deleteRule'
	});

	return {
		app,
		...process_collections(collections),
		user,
		server_auth: pocketbase.authStore.exportToCookie({ httpOnly: false }),
		public_route,
		header_links: [
			{
				name: 'Data',
				icon: 'icon-[ri--folder-2-line]',
				href: `/`
			}
		]
	};
}
