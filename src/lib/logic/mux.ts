import * as Upchunk from '@mux/upchunk';

const API_ENDPOINT = '/api/mux';

export type MuxMetaState = {
	mux_upload_id?: string;
	mux_playback_id?: string;
	is_uploading?: boolean;
	upload_progress?: number;
	is_processing?: boolean;
};

export class MuxUploader {
	#active_uploads: Map<string, any> = new Map();

	/**
	 * Initiates a Mux upload, tracks progress, and starts polling once uploaded.
	 */
	async upload(video_file: File, meta: MuxMetaState): Promise<void> {
		return new Promise(async (resolve, reject) => {
			meta.is_uploading = true;
			meta.upload_progress = 0;

			try {
				const res = await fetch(API_ENDPOINT, { method: 'POST' });
				const data = await res.json();

				if (!data.url) {
					console.error('The server response is missing the "url" property.');
					meta.is_uploading = false;
					return;
				}

				meta.mux_upload_id = data.upload_id;

				const upload_instance = Upchunk.createUpload({
					endpoint: data.url,
					file: video_file,
					chunkSize: 5120
				});

				this.#active_uploads.set(data.upload_id, upload_instance);

				upload_instance.on('progress', (e) => {
					meta.upload_progress = e.detail;
				});

				upload_instance.on('success', () => {
					meta.is_uploading = false;
					meta.upload_progress = 100;
					meta.is_processing = true;

					this.#active_uploads.delete(data.upload_id);
					this.#poll_for_playback_id(data.upload_id, meta, resolve);
				});

				upload_instance.on('error', (err) => {
					console.error('Upchunk upload error:', err);
					meta.is_uploading = false;
					reject(err);
				});
			} catch (err) {
				console.error('Failed to initialize Mux upload:', err);
				meta.is_uploading = false;
				reject(err);
			}
		});
	}

	/**
	 * Polls the server until the Mux video is ready and returns a playback ID.
	 */
	async #poll_for_playback_id(upload_id: string, meta: MuxMetaState, resolve: () => void) {
		const interval = setInterval(async () => {
			try {
				const res = await fetch(`${API_ENDPOINT}/${upload_id}`);
				const data = await res.json();

				if (data.status === 'ready' && data.playback_id) {
					meta.mux_playback_id = data.playback_id;
					meta.is_processing = false;

					clearInterval(interval);
					console.log('🎉 Mux Playback ID acquired:', data.playback_id);

					resolve();
				}
			} catch (error) {
				console.error('Polling error', error);
			}
		}, 2000);
	}

	cancel(upload_id: string | null | undefined) {
		if (!upload_id) return;
		if (this.#active_uploads.has(upload_id)) {
			this.#active_uploads.get(upload_id).abort();
			this.#active_uploads.delete(upload_id);
		}
	}

	/**
	 * Aborts an ongoing upload and notifies the server to delete the asset.
	 */
	async remove(meta: MuxMetaState) {
		if (!meta.mux_upload_id) return;

		// 1. Abort the frontend upload if it's currently running
		this.cancel(meta.mux_upload_id);

		// 2. Tell the server to delete the asset from Mux
		try {
			await fetch(API_ENDPOINT, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ upload_id: meta.mux_upload_id })
			});
		} catch (err) {
			console.error('Failed to notify server of deletion', err);
		}
	}
}
