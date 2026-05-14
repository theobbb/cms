// ─── Types ────────────────────────────────────────────────────────────────────

export type Aggregation = 'peak' | 'rms' | 'mean';

export interface WaveformParams {
	bar_count: number;
	aggregation: Aggregation;
	normalize: boolean;
	channel: number;
}

export interface WaveformData {
	samples: number[];
	duration: number;
	sampleRate: number;
	channelCount: number;
	totalFrames: number;
	params: WaveformParams;
}

export type WaveformMeta = {
	status: 'idle' | 'loading' | 'done' | 'error';
	data: WaveformData | null;
	error: string;
	fileName: string;
	// Parameters can be stored here per-file if needed
	params: WaveformParams;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_PARAMS: WaveformParams = {
	bar_count: 200,
	aggregation: 'rms',
	normalize: true,
	channel: -1
};

// ─── Multi-Extractor Class ───────────────────────────────────────────────────

export class WaveformExtractor {
	/**
	 * Keeps track of ongoing or completed extractions by a unique ID (e.g., file name or UUID)
	 * Using a Map allows the UI to track multiple files processing in parallel.
	 */
	#active_extractions: Map<string, AudioContext> = new Map();

	/**
	 * Processes an audio File and updates the provided meta state object.
	 */
	async extract(file: File, meta: WaveformMeta): Promise<WaveformData | null> {
		return new Promise(async (resolve, reject) => {
			if (
				!file.type.startsWith('audio/') &&
				!file.name.match(/\.(mp3|wav|ogg|flac|aac|m4a|opus|webm)$/i)
			) {
				this.#setError(meta, 'Not a valid audio file.');
				return resolve(null);
			}

			meta.status = 'loading';
			meta.error = '';
			meta.fileName = file.name;

			const audioCtx = new AudioContext();
			this.#active_extractions.set(file.name, audioCtx);

			try {
				const arrayBuffer = await file.arrayBuffer();

				// decodeAudioData can be rejected if the context is closed or data is corrupt
				const decoded = await audioCtx.decodeAudioData(arrayBuffer);

				const samples = WaveformExtractor.#buildSamples(decoded, meta.params);

				const result: WaveformData = {
					samples,
					duration: decoded.duration,
					sampleRate: decoded.sampleRate,
					channelCount: decoded.numberOfChannels,
					totalFrames: decoded.length,
					params: { ...meta.params }
				};

				meta.data = result;
				meta.status = 'done';

				this.#cleanup(file.name);
				resolve(result);
			} catch (e) {
				const msg = e instanceof Error ? e.message : 'Failed to decode audio.';
				this.#setError(meta, msg);
				this.#cleanup(file.name);
				resolve(null);
			}
		});
	}

	/**
	 * Aborts a specific extraction process by closing its AudioContext.
	 */
	cancel(fileName: string, meta: WaveformMeta) {
		const ctx = this.#active_extractions.get(fileName);
		if (ctx) {
			ctx.close();
			this.#active_extractions.delete(fileName);
			meta.status = 'idle';
		}
	}

	// ── Private helpers ────────────────────────────────────────────────────────

	#setError(meta: WaveformMeta, msg: string) {
		meta.error = msg;
		meta.status = 'error';
	}

	#cleanup(fileName: string) {
		const ctx = this.#active_extractions.get(fileName);
		if (ctx) {
			ctx.close();
			this.#active_extractions.delete(fileName);
		}
	}

	static #buildSamples(buffer: AudioBuffer, params: WaveformParams): number[] {
		const { bar_count, aggregation, normalize, channel } = params;
		const totalFrames = buffer.length;
		const channelCount = buffer.numberOfChannels;

		let mono: Float32Array;
		if (channel === -1) {
			mono = new Float32Array(totalFrames);
			for (let c = 0; c < channelCount; c++) {
				const ch = buffer.getChannelData(c);
				for (let i = 0; i < totalFrames; i++) mono[i] += ch[i];
			}
			const scale = 1 / channelCount;
			for (let i = 0; i < totalFrames; i++) mono[i] *= scale;
		} else {
			mono = buffer.getChannelData(Math.min(channel, channelCount - 1));
		}

		const framesPerBar = totalFrames / bar_count;
		const samples = new Array<number>(bar_count);

		for (let b = 0; b < bar_count; b++) {
			const start = Math.floor(b * framesPerBar);
			const end = Math.min(Math.floor((b + 1) * framesPerBar), totalFrames);
			const len = end - start;

			switch (aggregation) {
				case 'peak': {
					let max = 0;
					for (let i = start; i < end; i++) {
						const a = Math.abs(mono[i]);
						if (a > max) max = a;
					}
					samples[b] = max;
					break;
				}
				case 'rms': {
					let sum = 0;
					for (let i = start; i < end; i++) sum += mono[i] * mono[i];
					samples[b] = Math.sqrt(sum / len);
					break;
				}
				case 'mean': {
					let sum = 0;
					for (let i = start; i < end; i++) sum += Math.abs(mono[i]);
					samples[b] = sum / len;
					break;
				}
			}
		}

		if (normalize) {
			let maxVal = 1e-9;
			for (let i = 0; i < bar_count; i++) if (samples[i] > maxVal) maxVal = samples[i];
			for (let i = 0; i < bar_count; i++) samples[i] /= maxVal;
		}

		return samples;
	}
}

export function create_default_waveform_meta(): WaveformMeta {
	return {
		status: 'idle',
		data: null,
		error: '',
		fileName: '',
		params: { ...DEFAULT_PARAMS } // Cloned so it doesn't mutate the constant
	};
}
