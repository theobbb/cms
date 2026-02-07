export async function load({ locals: { pocketbase } }) {
	const [years] = await Promise.all([pocketbase.collection('years').getFullList({ sort: '-id' })]);

	const year = years[0].id;

	return {
		years,
		year
	};
}
