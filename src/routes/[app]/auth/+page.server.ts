import { super_auth_pocketbase } from '$lib/server/super-pocketbase';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export async function load({ url, locals: { app } }) {
	const invite_id = url.searchParams.get('invite');
	if (!invite_id) return;

	const super_pocketbase = await super_auth_pocketbase(app.pocketbase.url);
	const invite = await super_pocketbase.collection('users').getOne(invite_id);

	return { invite };
}

export const actions = {
	signin: async ({ request, locals, params }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		try {
			await locals.pocketbase.collection('users').authWithPassword(email, password);
		} catch (err) {
			console.log(err);
			return fail(400, { message: `Bruh, tu peux pas te connecter` });
		}

		throw redirect(303, '/' + params.app);
	}
} satisfies Actions;
