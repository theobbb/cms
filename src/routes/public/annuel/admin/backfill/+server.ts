import { json } from '@sveltejs/kit';

// export async function GET({ locals: { super_pocketbase } }) {
//
// 	console.log('.....');
// 	const records = await super_pocketbase.collection('students').getFullList();

// 	const chunkSize = 50;
// 	for (let i = 0; i < records.length; i += chunkSize) {
// 		const chunk = records.slice(i, i + chunkSize);
// 		await Promise.all(
// 			chunk.map((r) => super_pocketbase.collection('students').update(r.id, { is_latest: true }))
// 		);
// 	}

// 	return json({ success: true, total: records.length });
// }
