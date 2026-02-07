import type { PaginationResult } from '$lib/types';
import type { Field } from './field.types';
import type { RecordListOptions } from 'pocketbase';

export type App = {
	title: string;
	param?: string;
	pocketbase: {
		url: string;
	};

	collections: Record<string, Collection<any>>;
};

// collections

export type Collection<Record> = {
	name: string;
	fields: Field<Record>[];
	query?: RecordListOptions;
	display_key?: string;
	search_key?: string;
	// data?: PaginationResult<Record>;
};

// schema
export type Schema = TreeItem[];

export type TreeItem = Branch | Leaf;

type BaseItem = {
	name: string;
	param: string;
	path?: string;
};
export type Branch = BaseItem & {
	icon?: 'folder';
	children: TreeItem[];
};
export type Leaf = BaseItem & {
	icon?: 'folder';
	view?: 'table';
	collection: Collection<any>;
	query?: RecordListOptions;
};

// dynamic

// export type LinkBranches = {
// 	icon?: 'folder';
// 	children: Link[];
// };

// export type BlockCollection = {
// 	title: string;
// 	type: 'list' | 'table';
// 	collection: Collection<any>;
// 	query?: RecordListOptions;
// };

// export type Section
