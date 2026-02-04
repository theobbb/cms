import type { CollectionRecords, IsoDateString } from '$lib/pocketbase.types';

export type FieldBase<Record, T extends FieldType> = {
	type: T;
	name: Extract<keyof Record, string>;
	label?: string;
	required?: boolean;
};

export type Field<Record> = {
	[K in FieldType]: FieldBase<Record, K> & FieldConfig<Record>[K];
}[FieldType];

export type FieldType = keyof FieldConfig<any>;

type SubmitCallback<T> = (record: T) => void | Promise<void>;

type OnSubmit<T> = (
	form_data: FormData,
	cancel: () => void
) => void | Promise<void | ((record: T) => void | Promise<void>)>;

export type FieldProps<T extends FieldType> = FieldBase<any, T> &
	FieldConfig<any>[T] & {
		id: string;
		onsubmit?: OnSubmit<T>;
	};

export type FieldConfig<Record> = {
	string: Length & Value<string>;
	email: Length & Value<string>;
	url: Length &
		Value<string> & {
			on_extract?: (url: string, sleep?: number, scroll?: number) => void;
		};
	number: Length & Value<number>;
	text: Length &
		Value<string> & {
			rows?: number;
		};
	markdown: Length & Value<string>;
	slug: Length &
		Value<string> & {
			generate_key: keyof Record;
			generate_compare_collection?: keyof CollectionRecords;
		};
	bool: Value<boolean> & {};
	file: Length &
		Value<string | File | (string | File)[]> & {
			multiple?: boolean;
		};

	relation: RelationConfig<any> & Value<string | string[]>;
};

type RelationConfig<Target> = {
	collection: keyof CollectionRecords;
	multiple?: boolean;
	display_key: keyof Target;
	display_fn?: (record: Target) => string;
	expand?: Target | Target[] | null;
	count?: keyof Target;
};

export type FieldRelation<From, To> = FieldBase<From, 'relation'> & RelationConfig<To>;

type Value<V> = {
	value?: V;
};
type Length = {
	min_length?: number;
	max_length?: number;
};
