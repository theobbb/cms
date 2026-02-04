export function slugify(text: string): string {
	const cleanText = text.toLowerCase().trim();

	const normalizedText = cleanText.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	let slug = normalizedText;

	slug = slug
		.replace(/[^\w\s-]/g, ' ')
		.trim()
		.replace(/[-\s]+/g, '-');

	slug = slug.replace(/^-+|-+$/g, '');

	return slug;
}
