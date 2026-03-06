export async function load({ params, locals: { pocketbase } }) {
	const students = await pocketbase.collection('students').getFullList({
		filter: `year="${params.year}"`,
		sort: 'last_name'
	});
	const drafts = await pocketbase
		.collection('drafts')
		.getFullList({ filter: 'collection = "students"' });

	const draft_map = Object.fromEntries([...drafts].map((draft) => [draft.id, draft]));

	const marked_students = students.map((student) => ({
		...student,
		has_pending_draft: !!draft_map[student.id],
		pending_draft_type: 'existing'
	}));

	const student_ids = new Set(students.map((s) => s.id));

	const new_drafts = drafts
		.filter((draft) => !student_ids.has(draft.record_id))
		.map((d) => ({
			...d.data,
			has_pending_draft: true,
			pending_draft_type: 'new_request'
		}));

	const combined = [...marked_students, ...new_drafts].sort((a, b) =>
		(a.last_name || '').localeCompare(b.last_name || '')
	);

	return { students, drafts, draft_map, combined };
}
