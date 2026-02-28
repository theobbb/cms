import Bool from './fields/bool.svelte';
import Date from './fields/date.svelte';
import File from './fields/file.svelte';
import Relation from './fields/relation.svelte';
import String from './fields/string.svelte';
import Url from './fields/url.svelte';
import type { FieldType } from '$config/field.types';

// export type Column<Record> = {
// 	key: keyof Record;
// 	label: string;
// 	type?: ColumnType;
// 	sortable?: boolean;
// 	hidden?: boolean;
// 	snippet?: Snippet<[Record]>;
// };

// export type ColumnType = 'string' | 'url' | 'date' | 'bool' | 'color' | 'relation' | 'file';

export const ColumnComponents: Record<FieldType, any> = {
	//string: String,
	text: String,
	url: Url,
	relation: Relation,
	bool: Bool,
	number: String,
	email: String,
	markdown: String,
	file: File,
	select: String,
	//slug: String,
	date: Date,
	autodate: Date,
	json: String
};
