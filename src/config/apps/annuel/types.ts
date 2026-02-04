/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
	Authorigins = '_authOrigins',
	Externalauths = '_externalAuths',
	Mfas = '_mfas',
	Otps = '_otps',
	Superusers = '_superusers',
	Globals = 'globals',
	Programs = 'programs',
	ProjectDrafts = 'project_drafts',
	ProjectTags = 'project_tags',
	Projects = 'projects',
	Socials = 'socials',
	StudentDrafts = 'student_drafts',
	Students = 'students',
	Users = 'users',
	Years = 'years'
}

// Alias types for improved usability
export type IsoDateString = string;
export type IsoAutoDateString = string & { readonly autodate: unique symbol };
export type RecordIdString = string;
export type FileNameString = string & { readonly filename: unique symbol };
export type HTMLString = string;

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T };

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString;
	collectionId: string;
	collectionName: Collections;
} & ExpandType<T>;

export type AuthSystemFields<T = unknown> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string;
	created: IsoAutoDateString;
	fingerprint: string;
	id: string;
	recordRef: string;
	updated: IsoAutoDateString;
};

export type ExternalauthsRecord = {
	collectionRef: string;
	created: IsoAutoDateString;
	id: string;
	provider: string;
	providerId: string;
	recordRef: string;
	updated: IsoAutoDateString;
};

export type MfasRecord = {
	collectionRef: string;
	created: IsoAutoDateString;
	id: string;
	method: string;
	recordRef: string;
	updated: IsoAutoDateString;
};

export type OtpsRecord = {
	collectionRef: string;
	created: IsoAutoDateString;
	id: string;
	password: string;
	recordRef: string;
	sentTo?: string;
	updated: IsoAutoDateString;
};

export type SuperusersRecord = {
	created: IsoAutoDateString;
	email: string;
	emailVisibility?: boolean;
	id: string;
	password: string;
	tokenKey: string;
	updated: IsoAutoDateString;
	verified?: boolean;
};

export type GlobalsRecord = {
	created: IsoAutoDateString;
	id: string;
	updated: IsoAutoDateString;
};

export type ProgramsRecord<Tmetadata = unknown> = {
	created: IsoAutoDateString;
	description?: string;
	id: string;
	metadata?: null | Tmetadata;
	name: string;
	updated: IsoAutoDateString;
};

export type ProjectDraftsRecord = {
	created: IsoAutoDateString;
	description?: string;
	files?: FileNameString[];
	id: string;
	name: string;
	students: RecordIdString[];
	tags?: RecordIdString[];
	updated: IsoAutoDateString;
};

export type ProjectTagsRecord = {
	created: IsoAutoDateString;
	id: string;
	name: string;
	updated: IsoAutoDateString;
};

export type ProjectsRecord = {
	created: IsoAutoDateString;
	description?: string;
	files?: FileNameString[];
	id: string;
	name: string;
	students: RecordIdString[];
	tags?: RecordIdString[];
	updated: IsoAutoDateString;
	year: RecordIdString;
};

export type SocialsRecord = {
	created: IsoAutoDateString;
	id: string;
	name?: string;
	updated: IsoAutoDateString;
	url?: string;
};

export type StudentDraftsRecord<Tsocials = unknown> = {
	created: IsoAutoDateString;
	description?: string;
	id: string;
	socials?: null | Tsocials;
	updated: IsoAutoDateString;
};

export type StudentsRecord<Tsocials = unknown> = {
	created: IsoAutoDateString;
	description?: string;
	first_name: string;
	id: string;
	last_name: string;
	program: RecordIdString;
	scholarship?: boolean;
	socials?: null | Tsocials;
	updated: IsoAutoDateString;
	year: RecordIdString;
};

export type UsersRecord = {
	avatar?: FileNameString;
	created: IsoAutoDateString;
	email: string;
	emailVisibility?: boolean;
	id: string;
	name?: string;
	password: string;
	tokenKey: string;
	updated: IsoAutoDateString;
	verified?: boolean;
};

export type YearsRecord = {
	created: IsoAutoDateString;
	id: string;
	updated: IsoAutoDateString;
};

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> &
	BaseSystemFields<Texpand>;
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> &
	BaseSystemFields<Texpand>;
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>;
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>;
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> &
	AuthSystemFields<Texpand>;
export type GlobalsResponse<Texpand = unknown> = Required<GlobalsRecord> &
	BaseSystemFields<Texpand>;
export type ProgramsResponse<Tmetadata = unknown, Texpand = unknown> = Required<
	ProgramsRecord<Tmetadata>
> &
	BaseSystemFields<Texpand>;
export type ProjectDraftsResponse<Texpand = unknown> = Required<ProjectDraftsRecord> &
	BaseSystemFields<Texpand>;
export type ProjectTagsResponse<Texpand = unknown> = Required<ProjectTagsRecord> &
	BaseSystemFields<Texpand>;
export type ProjectsResponse<Texpand = unknown> = Required<ProjectsRecord> &
	BaseSystemFields<Texpand>;
export type SocialsResponse<Texpand = unknown> = Required<SocialsRecord> &
	BaseSystemFields<Texpand>;
export type StudentDraftsResponse<Tsocials = unknown, Texpand = unknown> = Required<
	StudentDraftsRecord<Tsocials>
> &
	BaseSystemFields<Texpand>;
export type StudentsResponse<Tsocials = unknown, Texpand = unknown> = Required<
	StudentsRecord<Tsocials>
> &
	BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;
export type YearsResponse<Texpand = unknown> = Required<YearsRecord> & BaseSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord;
	_externalAuths: ExternalauthsRecord;
	_mfas: MfasRecord;
	_otps: OtpsRecord;
	_superusers: SuperusersRecord;
	globals: GlobalsRecord;
	programs: ProgramsRecord;
	project_drafts: ProjectDraftsRecord;
	project_tags: ProjectTagsRecord;
	projects: ProjectsRecord;
	socials: SocialsRecord;
	student_drafts: StudentDraftsRecord;
	students: StudentsRecord;
	users: UsersRecord;
	years: YearsRecord;
};

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse;
	_externalAuths: ExternalauthsResponse;
	_mfas: MfasResponse;
	_otps: OtpsResponse;
	_superusers: SuperusersResponse;
	globals: GlobalsResponse;
	programs: ProgramsResponse;
	project_drafts: ProjectDraftsResponse;
	project_tags: ProjectTagsResponse;
	projects: ProjectsResponse;
	socials: SocialsResponse;
	student_drafts: StudentDraftsResponse;
	students: StudentsResponse;
	users: UsersResponse;
	years: YearsResponse;
};

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<
	{
		// Omit AutoDate fields
		[K in keyof T as Extract<T[K], IsoAutoDateString> extends never
			? K
			: never]: T[K] extends infer U // Convert FileNameString to File
			? U extends FileNameString | FileNameString[]
				? U extends any[]
					? File[]
					: File
				: U
			: never;
	},
	'id'
>;

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString;
	email: string;
	emailVisibility?: boolean;
	password: string;
	passwordConfirm: string;
	verified?: boolean;
} & ProcessCreateAndUpdateFields<T>;

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString;
} & ProcessCreateAndUpdateFields<T>;

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string;
	emailVisibility?: boolean;
	oldPassword?: string;
	password?: string;
	passwordConfirm?: string;
	verified?: boolean;
};

// Update type for Base collections
export type UpdateBase<T> = Partial<Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>>;

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>;

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>;

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>;
} & PocketBase;
