export async function load({ params, locals: { pocketbase } }) {
	//const pocketbase = new PocketBase(apps.annuel.pocketbase.url);

	const students = await pocketbase.collection('students').getFullList({
		filter: `year="${params.year}"`,
		sort: 'last_name'
	});
	const drafts = await pocketbase.collection('drafts').getFullList();
	const draft_map = Object.fromEntries([...drafts].map((draft) => [draft.id, draft]));

	return { students, drafts, draft_map };
}
