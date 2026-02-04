// Your helper function (unchanged)
// export function format_date(str: string): string {
// 	const date = new Date(str);

// 	const day: string = String(date.getUTCDate()).padStart(2, '0');
// 	const month: string = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
// 	const year: number = date.getUTCFullYear();

// 	// Note: This returns with dashes, matching your request "DD:MM:YYYY"
// 	// You can change the separator here if you prefer.
// 	return `${day}-${month}-${year}`;
// }

/**
 * Formats a date string into a relative time.
 * - < 1 min: "now"
 * - < 1 hr:  "...MM:SS"
 * - < 24 hr: "...HHh"
 * - > 24 hr: "DD-MM-YYYY"
 */
export function format_time(str: string): string {
	const date = new Date(str);
	const now = new Date();

	const diff_ms = now.getTime() - date.getTime();
	const diff_seconds = Math.floor(diff_ms / 1000);
	const diff_minutes = Math.floor(diff_seconds / 60);
	const diff_hours = Math.floor(diff_minutes / 60);

	// Case 1: Less than 1 minute ago
	if (diff_minutes < 1) {
		return `à l'instant`;
	}

	// Case 2: Less than 1 hour ago (Format: ...MM:SS)
	if (diff_hours < 1) {
		return `... ${String(diff_minutes).padStart(2, '0')} min`;
	}

	// Case 3: Less than 24 hours ago (Format: ...HHh)
	if (diff_hours < 24) {
		// Your request was "...HH", I've added the 'h' for clarity
		return `... ${diff_hours} h`;
	}

	// Case 4: 24 hours or more (Format: DD-MM-YYYY)
	return format_date(str);
}

export function format_date(str: string) {
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

	return `${day} ${month} ${year} - ${hours}:${minutes} `;
}
