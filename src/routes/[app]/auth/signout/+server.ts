import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	locals.pocketbase.authStore.clear();
	redirect(303, `/${params.app}/auth`);
};
