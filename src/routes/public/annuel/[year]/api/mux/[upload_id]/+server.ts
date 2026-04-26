import { json } from '@sveltejs/kit';
import Mux from '@mux/mux-node';
import { MUX_TOKEN_ID, MUX_TOKEN_SECRET } from '$env/static/private';

const mux = new Mux({
	tokenId: MUX_TOKEN_ID,
	tokenSecret: MUX_TOKEN_SECRET
});

export async function GET({ params }) {
	try {
		// 1. Fetch the Direct Upload object
		const upload = await mux.video.uploads.retrieve(params.upload_id);

		if (upload.status === 'waiting' || upload.status === 'uploading' || !upload.asset_id) {
			return json({ status: 'processing', playback_id: null });
		}

		// 2. Once Mux assigns an asset_id, fetch the actual Asset
		const asset = await mux.video.assets.retrieve(upload.asset_id);

		// 3. Extract the playback_id if it exists
		if (asset.playback_ids && asset.playback_ids.length > 0) {
			return json({
				status: 'ready',
				playback_id: asset.playback_ids[0].id
			});
		}

		// Still processing the asset
		return json({ status: 'processing', playback_id: null });
	} catch (error) {
		console.error('[MUX STATUS ERROR]', error);
		return json({ error: 'Failed to fetch status' }, { status: 500 });
	}
}
