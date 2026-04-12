<script lang="ts">
	import type { RecordModel } from 'pocketbase';
	import Drafts from '../drafts.svelte';
	import ListItem from '$lib/ui/components/list-item.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import { page } from '$app/state';
	import Text from '$lib/ui/editor/fields/text.svelte';

	type DraftRecord = RecordModel & { draft_of: string | null; draft: boolean; is_latest: boolean };
</script>

<Drafts collection="projects">
	{#snippet children(project: DraftRecord)}
		<div class="my-3">
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
				<div>Titre</div>
				<div>{project.name}</div>
			</div>
			<div>
				<div>Description</div>
				<div>{project.description}</div>
			</div>
			<div>
				<div>Finissant.es</div>
				<div class="border-b">
					{#each project?.expand?.students as student}
						<ListItem>{student.first_name} {student.last_name}</ListItem>
					{/each}
				</div>
			</div>
			<div>
				<div>Professeur.e</div>
				<div>{project.teacher}</div>
			</div>
			<Input {...page.data.collections.projects.field_map.teacher} />
			<div>
				<div>Cours</div>
				<div>{project.class || '—'}</div>
			</div>
			<div>
				<div>Session</div>
				<div>{project.session}</div>
			</div>
		</div>
	{/snippet}
</Drafts>
