<script lang="ts">
	import { type WaveformMeta } from '$lib/logic/waveform';

	let { meta }: { meta: WaveformMeta } = $props();

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

<div class="w-full">
	<svg viewBox="0 0 {PW} {PH}" xmlns="http://www.w3.org/2000/svg" class="block w-full">
		{@html svgBars}
	</svg>
</div>
