import { json } from '@sveltejs/kit';

// export async function GET({ locals: { super_pocketbase } }) {
// 	console.log('Starting update process...');

// 	// 1. Only fetch records that actually need updating to save bandwidth/CPU
// 	const records = await super_pocketbase.collection('projects').getFullList({
// 		filter: 'is_latest = false'
// 	});

// 	if (records.length === 0) {
// 		return json({ success: true, message: 'No records need updating.' });
// 	}

// 	const chunkSize = 50;

// 	for (let i = 0; i < records.length; i += chunkSize) {
// 		const chunk = records.slice(i, i + chunkSize);

// 		// 2. Initialize a new batch for this specific chunk
// 		const batch = super_pocketbase.createBatch();

// 		for (const r of chunk) {
// 			batch.collection('projects').update(r.id, { is_latest: true });
// 		}

// 		// 3. Send the batch (Single TCP connection for 50 updates)
// 		try {
// 			await batch.send();
// 			console.log(`Updated chunk starting at index ${i}`);
// 		} catch (err) {
// 			console.error(`Failed at index ${i}:`, err);
// 			return json({ success: false, error: 'Batch failed', details: err.message }, { status: 500 });
// 		}
// 	}

// 	return json({ success: true, total_updated: records.length });
// }
