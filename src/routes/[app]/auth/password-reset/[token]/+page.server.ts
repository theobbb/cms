import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	reset: async ({ request, params, url, locals: { pocketbase } }) => {
		const data = await request.formData();
		const password = data.get('password') as string;
		const token = params.token;

		const email = url.searchParams.get('email') || '';

		if (password.length < 4) {
			return fail(400, { message: 'Password must be at least 8 characters' });
		}
		if (!token) return fail(500, { message: 'Dsl' });
		try {
			// 4. Confirm Reset
			await pocketbase.collection('users').confirmPasswordReset(token, password, password);

			// 5. Authenticate immediately
			if (email)
				// This populates the authStore in event.locals.pocketbase
				await pocketbase.collection('users').authWithPassword(email, password);
		} catch (err) {
			console.error('PocketBase error:', err);
			return fail(400, { message: 'Le lien est invalide ou a expiré' });
		}

		redirect(303, '/');
	}
} satisfies Actions;
