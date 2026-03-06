<script>
	import Tooltip from '$lib/ui/components/pop/tooltip.svelte';

	const { row, name } = $props();
	const props_id = $props.id();
</script>

<div class="truncate text-ellipsis">
	<a
		class="peer not-hover:underline hover:decoration-0!"
		style="anchor-name: --url-preview-{props_id};"
		href={row[name]}
		target="_blank">{row[name]}</a
	>
	<Tooltip
		anchor="--url-preview-{props_id}"
		top="bottom"
		left="center"
		class="mt-2 -translate-x-1/2">Ouvrir dans un nouvel onglet</Tooltip
	>
</div>
