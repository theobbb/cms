import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	signin: async ({ request, locals, params }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		try {
			await locals.pocketbase.collection('users').authWithPassword(email, password);
		} catch (err) {
			return fail(400, { message: `Bruh, tu peux pas te connecter` });
		}

		throw redirect(303, '/' + params.app);
	}
} satisfies Actions;
