export async function load({ parent, locals: { pocketbase } }) {
	const { collections } = await parent();

	const years = await pocketbase.collection('years').getFullList({ sort: '-id' });

	return {
		years,
		collections
	};
}
