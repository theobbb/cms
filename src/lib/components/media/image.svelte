<script lang="ts">
	import { get_app } from '$lib/logic/ctx.svelte';
	import type { HTMLImgAttributes } from 'svelte/elements';

	let {
		record_id,
		filename,
		collection,
		size = '100x100',
		...props
	}: {
		record_id: string;
		filename: string;
		collection: string;
		size?: string;
	} & HTMLImgAttributes = $props();

	const app = get_app();

	const src = $derived(
		`${app.pocketbase.url}/api/files/${collection}/${record_id}/${filename}?format=webp&thumb=${size}`
	);
</script>

<img {src} loading="lazy" alt={props.alt || 'Media content'} {...props} />
