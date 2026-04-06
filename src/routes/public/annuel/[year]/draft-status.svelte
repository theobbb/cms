<script lang="ts">
	import type { RecordModel } from 'pocketbase';

	const { record }: { record: RecordModel } = $props();
</script>

<div>
	{#if record.draft}
		<div
			class={[
				'rounded-full- w-fit px-1.5 py-px',
				record.draft_of ? 'bg-blue text-blue-foreground ' : 'bg-green text-green-foreground'
			]}
		>
			<div class="text-xs">
				{record.draft_of ? `Modifié` : `Nouveau`}
			</div>
		</div>
	{/if}
</div>
