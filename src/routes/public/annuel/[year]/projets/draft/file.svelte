<script lang="ts">
	import { type RecordModel } from 'pocketbase';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';

	let { project, file }: { project: RecordModel | null; file: string | File } = $props();
</script>

<FileAttachment {file} record_id={project?.id} collection="projects" />
