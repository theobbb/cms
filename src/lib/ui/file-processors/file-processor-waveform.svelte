<script lang="ts">
	import type { MuxMetaState, MuxUploader } from '$lib/logic/mux';
	import {
		create_default_waveform_meta,
		type WaveformExtractor,
		type WaveformMeta
	} from '$lib/logic/waveform';
	import { file_is_audio, file_is_video } from '$lib/utils/files';
	import { extract_video_frame } from '$lib/utils/video';
	import AudioWaveform from '../components/audio-waveform.svelte';

	let {
		file = $bindable(),
		meta = $bindable(),
		extractor
	}: { file: File | string; meta: WaveformMeta; extractor: WaveformExtractor } = $props();

	if (!meta || Object.keys(meta).length === 0) {
		meta = create_default_waveform_meta();
	}

	let last_file: File | string | null = $state(null);

	function update_file() {
		if (!file) {
			return;
		}

		if (!(file instanceof File)) return;

		if (!file_is_audio(file)) return;

		console.log('extracing');
		extractor.extract(file, meta);
	}

	$effect(() => {
		if (file !== last_file) {
			update_file();
			last_file = file;
		}
	});

	const PW = 480;
	const PH = 72;

	let svgBars = $derived.by(() => {
		if (!meta.data) return '';
		const { samples } = meta.data;
		const barW = PW / samples.length;
		const gap = Math.max(0, barW * 0.28);
		const w = Math.max(0.5, barW - gap);
		return samples
			.map((v, i) => {
				const h = Math.max(1, v * (PH - 2));
				const x = i * barW + gap / 2;
				const y = PH / 2 - h / 2;
				return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="1" fill="#f59e0b" opacity="0.85"/>`;
			})
			.join('');
	});
</script>

<div class="pointer-events-none absolute inset-0">
	{#if meta.status == 'loading'}
		<span class="inline-block origin-center animate-spin text-3xl leading-none text-amber-400"
			>⟳</span
		>
	{:else if meta.status == 'done'}
		<AudioWaveform {meta} />
	{:else if meta.status == 'error'}
		<div class="w-full">
			<span class="text-3xl leading-none text-red-400">✕</span>
			<span class="text-sm text-red-400">{meta.error}</span>
			<span class="text-xs text-zinc-500">Click to try again</span>
		</div>
	{/if}
</div>
