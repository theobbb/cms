<script lang="ts">
	import type { RecordModel } from 'pocketbase';
	import Drafts from '../drafts.svelte';
	import ListItem from '$lib/ui/components/list-item.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import { page } from '$app/state';
	import Text from '$lib/ui/editor/fields/text.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';
	import PreviewFile from '../../../../../../public/annuel/[year]/projets/draft/preview-file.svelte';
	import { seed_meta_file } from '../../../../../../public/annuel/[year]/projets/draft/files.svelte';
	import { get_app } from '$lib/logic/ctx.svelte';

	type DraftRecord = RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean };

	const app = get_app();

	const N_COLS = 5;
</script>

<Drafts collection="projects">
	{#snippet children(project: DraftRecord)}
		<div class="my-3 space-y-4">
			<Input
				{...page.data.collections.projects.field_map.name}
				value={project.name}
				label="titre"
				disabled
			/>

			<Text
				{...page.data.collections.projects.field_map.description}
				value={project.description}
				label="description"
				disabled
				rows={4}
			/>

			<div>
				<div>Finissant.es</div>
				<div class="border-b">
					{#each project?.expand?.students as student}
						<ListItem>{student.first_name} {student.last_name}</ListItem>
					{/each}
				</div>
			</div>
			<Input
				{...page.data.collections.projects.field_map.teacher}
				value={project.teacher}
				label="Professeur.e"
				disabled
			/>
			<Input
				{...page.data.collections.projects.field_map.class}
				value={project.class}
				label="Cours"
				disabled
			/>
			<Input
				{...page.data.collections.projects.field_map.session}
				value={project.session}
				label="Session"
				disabled
			/>

			<Input
				{...page.data.collections.projects.field_map.background}
				value={project.background}
				label="Background"
				disabled
			/>

			{#if project?.thumbnail}
				<div class="my-12">
					<div class="mb-6">Thumbnail</div>
					<img
						src="{app.pocketbase
							.url}/api/files/projects/{project.id}/{project.thumbnail}?format=webp&thumb=400x500"
						alt="thumb"
					/>
				</div>
			{/if}
			<div>
				<div class="relative">
					<div
						class="grid gap-4 pb-16"
						style="grid-template-columns: repeat({N_COLS}, minmax(0, 1fr))"
					>
						{#each project?.files as file, i (file)}
							{@const meta = project?.meta_files?.[i] || seed_meta_file}
							{@const col_start = Number(meta?.col_start)}
							{@const col_span = Number(meta?.col_span)}

							<div
								style="grid-column: {col_start} / span {col_span};"
								class="group relative flex flex-col gap-1"
							>
								<div class=" relative overflow-hidden">
									<PreviewFile {file} record_id={project?.id} />
									{#if meta.is_uploading}
										<div
											class="bg-surface-900/80 absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity"
										>
											<span class="mb-2 font-mono text-sm tracking-wider text-white">
												{Math.round(meta.upload_progress || 0)}%
											</span>
											<div class="bg-surface-700 h-1 w-24 overflow-hidden rounded-full">
												<div
													class="h-full bg-white transition-all duration-100 ease-linear"
													style="width: {meta.upload_progress || 0}%"
												></div>
											</div>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>

					<div
						class="pointer-events-none absolute inset-0 -z-10 grid gap-4"
						style="grid-template-columns: repeat({N_COLS}, minmax(0, 1fr))"
					>
						{#each { length: N_COLS } as col, i}
							<div class="border-surface-100/50 bg-surface-50/20 h-full border-x"></div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</Drafts>
