import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const { years } = await parent();
	if (!years.find((y) => y.id == params.year)) error(404, 'Year not found');
}
