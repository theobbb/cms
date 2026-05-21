<script lang="ts">
	import type { RecordModel } from 'pocketbase';

	const { active }: { active: RecordModel } = $props();
</script>

<div
	class=" mt-4 w-full rounded-md bg-surface p-3 font-mono text-[11px] leading-relaxed ring-1 ring-white/10"
>
	<div class="flex justify-between">
		<span>x</span><span>{(active.left ?? 0).toFixed(1)}%</span>
	</div>
	<div class="flex justify-between">
		<span>y</span><span>{(active.top ?? 0).toFixed(1)}%</span>
	</div>
	<div class="flex justify-between">
		<span>w</span><span>{(active.width ?? 50).toFixed(1)}%</span>
	</div>
	<div class="mt-1 flex justify-between border-t border-white/10 pt-1">
		<span>↕ top</span><span>{(active.margin_top ?? 0).toFixed(1)}%</span>
	</div>
	<div class="flex justify-between">
		<span>↕ bot</span><span>{(active.margin_bottom ?? 0).toFixed(1)}%</span>
	</div>
</div>
