<script lang="ts">
	import Section from '$lib/components/section.svelte';
	import Editor from './editor.svelte';
	import Files from './files.svelte';
	import Header from './header.svelte';
	import Preview from './preview.svelte';
	import { init_editor } from './splash-editor.svelte';

	const editor = init_editor();
</script>

<Section size="full">
	<div class="flex h-full overflow-hidden font-sans">
		<div class="col-span-2 flex h-full flex-1 flex-col">
			<Header />

			<!-- Body -->
			<div class="flex h-full flex-1 overflow-hidden">
				<!-- Editor panel -->
				<Editor />

				<Preview />
			</div>
		</div>
		<div class="flex w-sm flex-col">
			<Files />
		</div>
	</div>
</Section>
