<script lang="ts">
	import Media from '$lib/components/media.svelte';
	import { get_app } from '$lib/logic/ctx.svelte';
	import { use_pocketbase } from '$lib/pocketbase';

	const {
		file,
		record_id
	}: {
		file: string | File;
		record_id: string | null | undefined;
	} = $props();

	let src = $state('');
	const app = get_app();

	$effect(() => {
		if (file instanceof File) {
			const object_url = URL.createObjectURL(file);
			src = object_url;

			// The cleanup function now cleanly captures the exact URL generated
			return () => {
				URL.revokeObjectURL(object_url);
			};
		}
		if (record_id) {
			src = `${app.pocketbase.url}/api/files/projects/${record_id}/${file}`;
		}
	});
</script>

<Media {src} alt="preview" />
