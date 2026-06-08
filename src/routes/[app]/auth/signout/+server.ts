import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({
	cookies,
	locals: { pocketbase, super_pocketbase }
}) => {
	const auth = pocketbase.authStore;

	if (auth.isValid && auth.record?.id) {
		// Delete the session row — this immediately invalidates the JWT
		await super_pocketbase
			.collection('sessions')
			.delete(auth.record.id)
			.catch(() => {});
	}

	auth.clear();
	cookies.delete('pb_auth', { path: '/' });

	redirect(303, '/auth');
};
