import type {
	ProgramsRecord,
	ProjectsRecord,
	ProjectTagsRecord,
	StudentsRecord
} from './pocketbase.types';

export type Record = {
	id: string
}

export interface PaginationResult<T> {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: T[];
}

export type DrawerType = 'inspect' | 'create' | 'edit' | null;
export type DrawerCtx<T> = {
	open: Boolean;
	type: DrawerType;
	target: T | null;
	close_drawer: () => void;
};

export type ProjectsRecordExpanded = ProjectsRecord & {
	expand: { students: StudentsRecord[]; tags: ProjectTagsRecord[] };
};
export type StudentsRecordExpanded = StudentsRecord & {
	expand: {
		program: ProgramsRecord;
		'projects(student)': ProjectsRecord[];
	};
};

export type Social = { name: string; url: string };

export type FormSubmitEvent = SubmitEvent & { currentTarget: EventTarget & HTMLFormElement };
