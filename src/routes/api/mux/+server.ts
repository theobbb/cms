// src/routes/api/mux/upload/+server.ts
import { json } from '@sveltejs/kit';
import Mux from '@mux/mux-node';
import { MUX_TOKEN_ID, MUX_TOKEN_SECRET } from '$env/static/private';

const mux = new Mux({
	tokenId: MUX_TOKEN_ID,
	tokenSecret: MUX_TOKEN_SECRET
});

export async function POST() {
	try {
		const upload = await mux.video.uploads.create({
			new_asset_settings: {
				playback_policy: ['public']
			},
			cors_origin: '*' // Restrict this to your domain in production
		});

		return json({
			url: upload.url,
			upload_id: upload.id
		});
	} catch (error) {
		// Log the actual error to your terminal (not browser) to see why Mux is failing
		console.error('[MUX SDK ERROR]', error);
	}
}

export async function DELETE({ request }) {
	try {
		const body = await request.json();
		const { upload_id } = body;

		if (!upload_id) {
			return json({ error: 'Missing upload_id' }, { status: 400 });
		}

		// 1. Retrieve the upload to check its status
		const upload = await mux.video.uploads.retrieve(upload_id);

		// 2. If Mux already finished processing it into a permanent asset, delete the asset
		if (upload.asset_id) {
			await mux.video.assets.delete(upload.asset_id);
		} else {
			// 3. If it's still waiting or uploading, cancel the direct upload
			await mux.video.uploads.cancel(upload_id);
		}

		return json({ success: true });
	} catch (error) {
		console.error('[MUX DELETE ERROR]', error);
		return json({ error: 'Failed to delete Mux asset' }, { status: 500 });
	}
}
