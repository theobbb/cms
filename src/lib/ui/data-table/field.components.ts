import type { FieldType } from '$config/field.types';
import Bool from './fields/bool.svelte';
import Date from './fields/date.svelte';
import File from './fields/file.svelte';
import Relation from './fields/relation.svelte';
import String from './fields/string.svelte';
import Url from './fields/url.svelte';
import Json from './fields/json.svelte';
import Color from './fields/color.svelte';

export const ColumnComponents: Record<FieldType, any> = {
	text: String,
	url: Url,
	relation: Relation,
	bool: Bool,
	number: String,
	email: String,
	color: Color,
	markdown: String,
	file: File,
	select: String,
	//slug: String,
	date: Date,
	autodate: Date,
	json: Json
};
