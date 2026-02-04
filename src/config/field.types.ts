import type { CollectionRecords } from '$lib/pocketbase.types';

export type FieldBase<Record, T extends FieldType> = {
	type: T;
	key: Extract<keyof Record, string>;
	title?: string;
	required?: boolean;
};

export type Field<Record> = {
	[K in FieldType]: FieldBase<Record, K> & FieldConfig<Record>[K];
}[FieldType];

export type FieldType = keyof FieldConfig<any>;

type SubmitCallback<T> = (
	form_data: FormData,
	cancel: () => void
) => void | Promise<void | ((record: T) => void | Promise<void>)>;

export type FieldProps<T extends FieldType> = FieldBase<any, T> &
	FieldConfig<any>[T] & {
		id: string;
		onsubmit?: SubmitCallback<T>;
	};

export type FieldConfig<Record> = {
	string: Length & Value<string>;
	email: Length & Value<string>;
	url: Value<string>;
	number: Value<number>;
	text: Length &
		Value<string> & {
			rows?: number;
		};
	markdown: Length &
		Value<string> & {
			rows?: number;
		};
	slug: Length &
		Value<string> & {
			generate?: {
				key: keyof Record;
			};
		};
	bool: Value<boolean> & {};
	file: Length &
		Value<string | File | (string | File)[]> & {
			multiple?: boolean;
		};

	date: Value<string> & {};
	relation: Value<string | string[]> & {
		collection: string;
		multiple?: boolean;
	};
};

// type RelationConfig<Target> = {
// 	expand: {
// 		collection: string;
// 		display_key: keyof Target;
// 		displayer?: (record: Target) => string;
// 	};
// 	multiple?: boolean;
// };

// export type FieldRelation<From, To> = FieldBase<From, 'relation'> & RelationConfig<To>;

type Value<V> = {
	value?: V;
};
type Length = {
	min_length?: number;
	max_length?: number;
};
