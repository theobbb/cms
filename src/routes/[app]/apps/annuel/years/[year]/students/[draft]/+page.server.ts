import type { StudentDraftsRecord, StudentsRecord } from '$lib/pocketbase.types';

export async function load({ params, depends, locals: { pocketbase } }) {
	depends('data:student_draft');
	const student: StudentsRecord = await pocketbase.collection('students').getOne(params.draft);

	let draft: StudentDraftsRecord | null = null;
	try {
		draft = await pocketbase.collection('student_drafts').getOne(params.draft);
	} catch (error) {}

	return { student, draft };
}
