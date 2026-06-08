import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const { years } = await parent();
	const year = years.find((y) => y.id == params.year);

	if (!year) error(404, 'Year not found');

	return { year };
}
