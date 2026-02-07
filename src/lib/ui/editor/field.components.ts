import String from './fields/string.svelte';
import Text from './fields/text.svelte';
import Number from './fields/number.svelte';
import Bool from './fields/bool.svelte';
import File from './fields/file.svelte';
import Relation from './fields/relation.svelte';
import Url from './fields/url.svelte';
import Markdown from './fields/markdown.svelte';
import Slug from './fields/slug.svelte';
import type { FieldType } from '$config/field.types';
import Date from './fields/date.svelte';

export const FieldComponents: Record<FieldType, any> = {
	email: String,
	url: Url,
	text: String,
	number: Number,
	// slug: Slug,
	bool: Bool,
	file: File,
	relation: Relation,
	markdown: Markdown,
	date: Date,
	json: String
};
