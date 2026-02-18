export async function load({ params, locals: { pocketbase } }) {
	//const pocketbase = new PocketBase(apps.annuel.pocketbase.url);

	const students = await pocketbase.collection('students').getFullList({
		filter: `year="${params.year}"`,
		sort: 'last_name'
	});

	return { students };
}
