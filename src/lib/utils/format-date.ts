export function format_date(str: string | null | undefined): string {
	if (!str) return '';
	const date = new Date(str);

	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const year = date.getFullYear();

	const months = [
		'janv.',
		'févr.',
		'mars',
		'avr.',
		'mai',
		'juin',
		'juil.',
		'août',
		'sept.',
		'oct.',
		'nov.',
		'déc.'
	];

	const month = months[date.getMonth()];

	return `${day} ${month} ${year}, ${hours}:${minutes} `;
}
