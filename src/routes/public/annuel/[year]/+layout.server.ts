import { error } from '@sveltejs/kit';

export async function load({ params, locals: { pocketbase } }) {
	try {
		await pocketbase.collection('years').getOne(params.year);
	} catch (_) {
		error(404, 'Année introuvable');
	}
}
