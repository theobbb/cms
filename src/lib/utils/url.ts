export function url_query_param(src: string, key: string, value: string | null) {
	const url = new URL(src);
	if (!value) url.searchParams.delete(key);
	else url.searchParams.set(key, value);
	return url.toString();
}
