<script lang="ts">
	import Section from '$lib/components/section.svelte';
	import { init_form_action } from '$lib/logic/form-action.svelte.js';
	import {
		create_default_waveform_meta,
		WaveformExtractor,
		type WaveformMeta
	} from '$lib/logic/waveform.js';
	import { use_pocketbase } from '$lib/pocketbase.js';
	import Button from '$lib/ui/components/button.svelte';
	import { EditorCollectionList } from '$lib/ui/data-table/collection-list.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';
	import FileInput from '$lib/ui/editor/fields/file.svelte';
	import FileProcessorWaveform from '$lib/ui/file-processors/file-processor-waveform.svelte';

	const { data } = $props();
	const { collections } = $derived(data);

	const collection = $derived(collections.globals);
	const list = new EditorCollectionList(collection);

	const pocketbase = use_pocketbase();
	const form_action = init_form_action();

	const globals = $derived(list.items?.[0]);

	const waveform_extractor = new WaveformExtractor();

	let audio_files: (File | string)[] = $state([]);
	let audio_meta: WaveformMeta = $state(create_default_waveform_meta());

	$effect(() => {
		if (globals) {
			audio_files = globals?.audio ? [globals?.audio] : [];
			audio_meta = globals?.audio_meta ? globals?.audio_meta : create_default_waveform_meta();
		}
	});

	const onsubmit = form_action.submit(async ({ form_data, cancel }) => {
		form_data.set('audio_meta', JSON.stringify(audio_meta || {}));
		await pocketbase.collection('globals').update(globals.id, form_data);

		form_action.toaster.push('success', 'Enregistré');
	});
</script>

<form class="contents" {onsubmit}>
	<Section>
		{#if globals}
			<FileInput
				{...collections.globals.field_map.audio}
				value={globals?.audio}
				bind:files={audio_files}
				label="images et/ou vidéos"
				record={globals}
				{onchange}
			>
				{#snippet children(file, i)}
					<div class="relative overflow-hidden rounded-md">
						<FileAttachment {file} record_id={globals?.id} collection="globals" />
						<FileProcessorWaveform
							bind:file={audio_files[0]}
							bind:meta={audio_meta}
							extractor={waveform_extractor}
						/>
					</div>
				{/snippet}
			</FileInput>
			<div class="mt-3x"><Button type="submit" variant="action">Enregistrer</Button></div>
		{/if}
	</Section>
</form>
<!-- <div class="">
	<div class="">
		<div class="flex flex-col gap-1.5">
			<AudioWaveform />
		</div>

	</div>
</div> -->
