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
	BookmarkFolderCount = 'bookmark_folder_count',
	BookmarkFolders = 'bookmark_folders',
	BookmarkTagCounts = 'bookmark_tag_counts',
	BookmarkTagGroups = 'bookmark_tag_groups',
	BookmarkTags = 'bookmark_tags',
	Bookmarks = 'bookmarks',
	Chat = 'chat',
	Comments = 'comments',
	Documents = 'documents',
	Feedback = 'feedback',
	InfoTags = 'info_tags',
	Infos = 'infos',
	Links = 'links',
	MemberEntries = 'member_entries',
	Members = 'members',
	Notifications = 'notifications',
	Posters = 'posters',
	Related = 'related',
	Roles = 'roles',
	Settings = 'settings',
	Tickets = 'tickets',
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

export type BookmarkFolderCountRecord<Ttotal_children = unknown> = {
	id: string;
	total_children?: null | Ttotal_children;
};

export type BookmarkFoldersRecord = {
	created: IsoAutoDateString;
	description?: string;
	id: string;
	parent?: RecordIdString;
	path?: string;
	title: string;
	updated: IsoAutoDateString;
};

export type BookmarkTagCountsRecord = {
	bookmark_count?: number;
	id: string;
	tag?: RecordIdString;
};

export type BookmarkTagGroupsRecord = {
	created: IsoAutoDateString;
	id: string;
	name?: string;
	tag_count?: number;
	updated: IsoAutoDateString;
};

export type BookmarkTagsRecord = {
	bookmark_count?: number;
	color?: string;
	created: IsoAutoDateString;
	id: string;
	name?: string;
	parent?: RecordIdString;
	updated: IsoAutoDateString;
};

export type BookmarksRecord = {
	approved?: boolean;
	author?: string;
	created: IsoAutoDateString;
	description?: string;
	draft?: boolean;
	favicon?: FileNameString;
	id: string;
	likes?: number;
	parent?: RecordIdString;
	screenshot?: FileNameString;
	tags?: RecordIdString[];
	title: string;
	updated: IsoAutoDateString;
	url: string;
};

export type ChatRecord = {
	author?: string;
	body: string;
	created: IsoAutoDateString;
	id: string;
};

export enum CommentsTypeOptions {
	'user_comment' = 'user_comment',
	'status_change' = 'status_change',
	'ticket_moved' = 'ticket_moved',
	'public' = 'public',
	'renamed' = 'renamed',
	'moved' = 'moved',
	'admin' = 'admin',
	'system' = 'system'
}

export enum CommentsCollectionOptions {
	'tickets' = 'tickets',
	'bookmarks' = 'bookmarks'
}
export type CommentsRecord = {
	author_id?: RecordIdString;
	author_name?: string;
	body: string;
	collection?: CommentsCollectionOptions;
	created: IsoAutoDateString;
	id: string;
	parent: string;
	parent_comment?: RecordIdString;
	type: CommentsTypeOptions;
	updated: IsoAutoDateString;
};

export type DocumentsRecord = {
	body?: string;
	created: IsoAutoDateString;
	file?: FileNameString;
	hidden?: boolean;
	id: string;
	order?: number;
	title?: string;
	updated: IsoAutoDateString;
};

export type FeedbackRecord = {
	author_email?: string;
	author_name?: string;
	body?: string;
	created: IsoAutoDateString;
	id: string;
	ip_address?: string;
	updated: IsoAutoDateString;
};

export type InfoTagsRecord = {
	created: IsoAutoDateString;
	id: string;
	title?: string;
	updated: IsoAutoDateString;
};

export type InfosRecord = {
	body?: string;
	created: IsoAutoDateString;
	id: string;
	order?: number;
	tags?: RecordIdString[];
	title?: string;
	updated: IsoAutoDateString;
};

export type LinksRecord = {
	created: IsoAutoDateString;
	hidden?: boolean;
	icon?: string;
	id: string;
	name: string;
	order?: number;
	updated: IsoAutoDateString;
	url: string;
};

export type MemberEntriesRecord = {
	created: IsoAutoDateString;
	id: string;
	member: RecordIdString;
	role: RecordIdString;
	updated: IsoAutoDateString;
	year: RecordIdString;
};

export type MembersRecord = {
	archived?: boolean;
	code?: string;
	created: IsoAutoDateString;
	email?: string;
	id: string;
	name?: string;
	phone?: number;
	role?: RecordIdString;
	updated: IsoAutoDateString;
	user?: RecordIdString;
};

export type NotificationsRecord = {
	body?: string;
	created: IsoAutoDateString;
	id: string;
	status_code: number;
	title?: string;
	user?: RecordIdString;
};

export type PostersRecord = {
	body?: string;
	created: IsoAutoDateString;
	date: IsoDateString;
	id: string;
	images: FileNameString[];
	slug?: string;
	title: string;
	updated: IsoAutoDateString;
};

export type RelatedRecord = {
	body?: string;
	created: IsoAutoDateString;
	id: string;
	name: string;
	order?: number;
	updated: IsoAutoDateString;
};

export type RolesRecord = {
	color?: string;
	created: IsoAutoDateString;
	description?: string;
	field?: HTMLString;
	id: string;
	level?: number;
	name?: string;
	updated: IsoAutoDateString;
};

export type SettingsRecord = {
	created: IsoAutoDateString;
	featured: RecordIdString;
	id: string;
	updated: IsoAutoDateString;
	year: RecordIdString;
};

export enum TicketsStatusOptions {
	'new' = 'new',
	'open' = 'open',
	'in_progress' = 'in_progress',
	'in_review' = 'in_review',
	'on_hold' = 'on_hold',
	'duplicate' = 'duplicate',
	'reopened' = 'reopened',
	'resolved' = 'resolved',
	'closed' = 'closed'
}

export enum TicketsPriorityOptions {
	'urgent' = 'urgent',
	'can_wait' = 'can_wait'
}
export type TicketsRecord = {
	assigned_members?: RecordIdString[];
	assigned_roles?: RecordIdString[];
	body?: string;
	created: IsoAutoDateString;
	created_by: RecordIdString;
	due_date?: IsoDateString;
	id: string;
	parent?: RecordIdString;
	priority?: TicketsPriorityOptions;
	status: TicketsStatusOptions;
	title: string;
	updated: IsoAutoDateString;
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
	username?: string;
	verified?: boolean;
};

export type YearsRecord = {
	id: string;
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
export type BookmarkFolderCountResponse<Ttotal_children = unknown, Texpand = unknown> = Required<
	BookmarkFolderCountRecord<Ttotal_children>
> &
	BaseSystemFields<Texpand>;
export type BookmarkFoldersResponse<Texpand = unknown> = Required<BookmarkFoldersRecord> &
	BaseSystemFields<Texpand>;
export type BookmarkTagCountsResponse<Texpand = unknown> = Required<BookmarkTagCountsRecord> &
	BaseSystemFields<Texpand>;
export type BookmarkTagGroupsResponse<Texpand = unknown> = Required<BookmarkTagGroupsRecord> &
	BaseSystemFields<Texpand>;
export type BookmarkTagsResponse<Texpand = unknown> = Required<BookmarkTagsRecord> &
	BaseSystemFields<Texpand>;
export type BookmarksResponse<Texpand = unknown> = Required<BookmarksRecord> &
	BaseSystemFields<Texpand>;
export type ChatResponse<Texpand = unknown> = Required<ChatRecord> & BaseSystemFields<Texpand>;
export type CommentsResponse<Texpand = unknown> = Required<CommentsRecord> &
	BaseSystemFields<Texpand>;
export type DocumentsResponse<Texpand = unknown> = Required<DocumentsRecord> &
	BaseSystemFields<Texpand>;
export type FeedbackResponse<Texpand = unknown> = Required<FeedbackRecord> &
	BaseSystemFields<Texpand>;
export type InfoTagsResponse<Texpand = unknown> = Required<InfoTagsRecord> &
	BaseSystemFields<Texpand>;
export type InfosResponse<Texpand = unknown> = Required<InfosRecord> & BaseSystemFields<Texpand>;
export type LinksResponse<Texpand = unknown> = Required<LinksRecord> & BaseSystemFields<Texpand>;
export type MemberEntriesResponse<Texpand = unknown> = Required<MemberEntriesRecord> &
	BaseSystemFields<Texpand>;
export type MembersResponse<Texpand = unknown> = Required<MembersRecord> &
	BaseSystemFields<Texpand>;
export type NotificationsResponse<Texpand = unknown> = Required<NotificationsRecord> &
	BaseSystemFields<Texpand>;
export type PostersResponse<Texpand = unknown> = Required<PostersRecord> &
	BaseSystemFields<Texpand>;
export type RelatedResponse<Texpand = unknown> = Required<RelatedRecord> &
	BaseSystemFields<Texpand>;
export type RolesResponse<Texpand = unknown> = Required<RolesRecord> & BaseSystemFields<Texpand>;
export type SettingsResponse<Texpand = unknown> = Required<SettingsRecord> &
	BaseSystemFields<Texpand>;
export type TicketsResponse<Texpand = unknown> = Required<TicketsRecord> &
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
	bookmark_folder_count: BookmarkFolderCountRecord;
	bookmark_folders: BookmarkFoldersRecord;
	bookmark_tag_counts: BookmarkTagCountsRecord;
	bookmark_tag_groups: BookmarkTagGroupsRecord;
	bookmark_tags: BookmarkTagsRecord;
	bookmarks: BookmarksRecord;
	chat: ChatRecord;
	comments: CommentsRecord;
	documents: DocumentsRecord;
	feedback: FeedbackRecord;
	info_tags: InfoTagsRecord;
	infos: InfosRecord;
	links: LinksRecord;
	member_entries: MemberEntriesRecord;
	members: MembersRecord;
	notifications: NotificationsRecord;
	posters: PostersRecord;
	related: RelatedRecord;
	roles: RolesRecord;
	settings: SettingsRecord;
	tickets: TicketsRecord;
	users: UsersRecord;
	years: YearsRecord;
};

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse;
	_externalAuths: ExternalauthsResponse;
	_mfas: MfasResponse;
	_otps: OtpsResponse;
	_superusers: SuperusersResponse;
	bookmark_folder_count: BookmarkFolderCountResponse;
	bookmark_folders: BookmarkFoldersResponse;
	bookmark_tag_counts: BookmarkTagCountsResponse;
	bookmark_tag_groups: BookmarkTagGroupsResponse;
	bookmark_tags: BookmarkTagsResponse;
	bookmarks: BookmarksResponse;
	chat: ChatResponse;
	comments: CommentsResponse;
	documents: DocumentsResponse;
	feedback: FeedbackResponse;
	info_tags: InfoTagsResponse;
	infos: InfosResponse;
	links: LinksResponse;
	member_entries: MemberEntriesResponse;
	members: MembersResponse;
	notifications: NotificationsResponse;
	posters: PostersResponse;
	related: RelatedResponse;
	roles: RolesResponse;
	settings: SettingsResponse;
	tickets: TicketsResponse;
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
