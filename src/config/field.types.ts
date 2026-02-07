export type FieldConfig = {
	//string: FieldTextBase & { value: string };
	text: FieldTextBase & { value: string; rows?: number };
	markdown: FieldTextBase & { value: string; rows?: number };
	number: {
		value: number;
	};
	bool: {
		value: boolean;
	};
	email: {
		value: string;
		exceptDomains: string;
	};
	url: {
		value: string;
	};
	date: {
		value: string;
	};
	autodate: {
		value: string;
	};
	select: {
		value: string;
	};
	file: {
		value: (string | File)[];
		minSelect: number;
		maxSelect: number;
		maxSize: number;
		thumbs: string[];
		mimeTypes: string[];
	};
	relation: {
		value: string | string[];
		cascadeDelete: boolean;
		collectionId: string;
		minSelect: number;
		maxSelect: number;
	};
	// slug: Length &
	// 	Value<string> & {
	// 		generate?: {
	// 			key: keyof Record;
	// 		};
	// 	};
	// geopoint: Value<string> & {};
	json: {
		value: string;
	};
};

type FieldTextBase = {
	min: number;
	max: number;
	pattern: string;
	autogeneratePattern: string;
};

export type FieldBase<Record, T extends FieldType> = {
	id: string;
	hidden: boolean;
	type: T;
	name: Extract<keyof Record, string>;
	required: boolean;
	primaryKey: boolean;
};

export type Field<Record> = {
	[K in FieldType]: FieldBase<Record, K> & FieldConfig[K];
}[FieldType];

export type FieldType = keyof FieldConfig;

type SubmitCallback<T> = (
	form_data: FormData,
	cancel: () => void
) => void | Promise<void | ((record: T) => void | Promise<void>)>;

export type FieldProps<T extends FieldType> = FieldBase<any, T> &
	FieldConfig[T] & {
		id: string;
		onsubmit?: SubmitCallback<T>;
	};
