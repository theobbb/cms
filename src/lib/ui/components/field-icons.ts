import type { FieldType } from '$config/field.types';

export const FIELD_ICONS: Record<FieldType, string> = {
	text: 'icon-[ri--text]',
	url: 'icon-[ri--link-m]',
	relation: 'icon-[ri--mind-map]',
	bool: '',
	number: 'icon-[ri--hashtag]',
	email: 'icon-[ri--text]',
	color: 'icon-[ri--color-filter-line]',
	markdown: 'icon-[ri--text]',
	file: 'icon-[ri--image-line]',
	select: 'icon-[ri--text]',
	//slug: String,
	date: 'icon-[ri--calendar-line]',
	autodate: 'icon-[ri--text]',
	json: 'icon-[ri--braces-fill]'
};
