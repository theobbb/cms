<script lang="ts">
	import Section from '$lib/components/section.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import { format_bytes } from '$lib/utils/format-bytes.js';

	const { data } = $props();

	$inspect(data);
</script>

<div>
	<div>
		Sauvegarde et restauration des données <Button
			icon="icon-[ri--upload-cloud-line]"
			variant="ghost"
			tooltip="Upload backup"
		/>
	</div>
	<div>Ce système fait des sauvegardes automatiques à chaque dimanche 00:00</div>
	<div>Maximum 3 @auto backups à la fois</div>
	<div class="max-w-2xl">
		{#each data.backups as backup}
			<div class="group flex min-h-10 items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="icon-[ri--folder-zip-line]"></div>
					<div class="font-mono text-sm"><span>{backup.key}</span></div>
					<div class="text-foreground-muted text-sm">{format_bytes(backup.size)}</div>
				</div>
				<div class="flex gap-1 transition duration-100 not-group-hover:opacity-0">
					<div><Button icon="icon-[ri--download-line]" variant="ghost" tooltip="Download" /></div>
					<div><Button icon="icon-[ri--restart-line]" variant="ghost" tooltip="Restore" /></div>
					<div><Button icon="icon-[ri--delete-bin-7-line]" variant="ghost" tooltip="Delete" /></div>
				</div>
			</div>
		{/each}
	</div>
</div>
