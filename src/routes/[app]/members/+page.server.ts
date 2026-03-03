export async function load({ parent }) {
	const { collections } = await parent();

	collections.users.field_map.created.hidden = true;
	collections.users.field_map.created.hidden = true;
	collections.users.field_map.updated.label = 'dernière connexion';
	collections.users.field_map.verified.label = ' ';

	return { collections };
}
