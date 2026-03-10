export async function load({ locals: { super_pocketbase } }) {
	const backups = await super_pocketbase.backups.getFullList();

	return { backups };
}
