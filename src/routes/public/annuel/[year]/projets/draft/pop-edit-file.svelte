<script lang="ts">
	import { page } from '$app/state';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import type { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import File from '$lib/ui/editor/fields/file.svelte';
	import Number from '$lib/ui/editor/fields/number.svelte';
	import Text from '$lib/ui/editor/fields/text.svelte';
	import type { RecordModel } from 'pocketbase';
	import Info from '../../info.svelte';
	import FlagInfo from '$lib/ui/templates/flags/info.svelte';

	import { seed_meta_file, type MetaFile, type MetaFiles } from './files.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';

	let {
		pop,
		meta_files = $bindable(),
		file,
		project
	}: {
		pop: Pop;
		meta_files: MetaFiles;
		file: string | undefined | null;
		project: RecordModel | null;
	} = $props();
</script>

<Dialog {pop}>
	<div class="space-y-3x">
		<FlagInfo>Options supplémentaires (optionnelles) <br /> de mise en page.</FlagInfo>
		{#if file && project}
			<FileAttachment {file} record_id={project.id} collection="projects" />
		{/if}

		<Info>
			<div>Petite caption en dessous de l’image/vidéo</div>
		</Info>
		<Text
			{...page.data.collections.project_files.field_map.caption}
			rows={3}
			label="caption"
			bind:value={meta_files[file].caption}
		/>
		<div class="grid grid-cols-2 gap-3">
			<div>
				<Info>Début de la colonne</Info>
				<Number
					{...page.data.collections.project_files.field_map.col_start}
					label="col start"
					bind:value={meta.col_start}
				/>
			</div>
			<div>
				<Info>Nombre de colonnes</Info>
				<Number
					{...page.data.collections.project_files.field_map.col_span}
					label="col span"
					bind:value={meta.col_span}
				/>
			</div>
		</div>
		<div>
			<a class="text-link" href="/help/annuel/fichiers">En savoir plus sur les colonnes →</a>
		</div>
	</div>
</Dialog>
