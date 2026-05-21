<script>
	import Box from '$lib/components/box.svelte';
	import { use_copy } from '$lib/copy';
	import { txt } from '$lib/copy/utils';
	import Info from '$lib/ui/templates/flags/info.svelte';

	const { name } = $props();

	const copy = use_copy();
</script>

<Box color="surface" class="my-4x w-full space-y-3x p-3x">
	<div class="text-center text-xl">{txt(copy.auth.register.title, { name })}</div>

	<Info>{copy.auth.register.info}</Info>
</Box>
