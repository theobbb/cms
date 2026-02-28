import String from './fields/string.svelte';
import Number from './fields/number.svelte';
import Bool from './fields/bool.svelte';
import File from './fields/file.svelte';
import Relation from './fields/relation.svelte';
import Url from './fields/url.svelte';
import Markdown from './fields/markdown.svelte';
import type { FieldType } from '$config/field.types';
import Date from './fields/date.svelte';

export const FieldComponents: Record<FieldType, any> = {
	text: String,
	number: Number,
	email: String,
	url: Url,

	// slug: Slug,
	bool: Bool,
	file: File,
	relation: Relation,
	markdown: Markdown,
	date: Date,
	autodate: Date,
	select: String,
	json: String
};
