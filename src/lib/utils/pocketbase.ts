export function pocketbase_file_url(
	pocketbase_url: string,
	collection_name: string,
	record_id: string,
	file_name: string
) {
	return `${pocketbase_url}/api/files/${collection_name}/${record_id}/${file_name}`;
}
