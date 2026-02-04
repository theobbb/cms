import type { Snippet } from 'svelte';
import Bool from './columns/bool.svelte';
import Date from './columns/date.svelte';
import File from './columns/file.svelte';
import Relation from './columns/relation.svelte';
import String from './columns/string.svelte';
import Url from './columns/url.svelte';
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
	string: String,

	url: Url,
	relation: Relation,
	bool: Bool,
	number: String,
	email: String,
	text: String,
	markdown: String,
	file: File,
	slug: String
};
