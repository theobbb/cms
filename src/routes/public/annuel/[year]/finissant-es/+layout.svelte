<script lang="ts">
	import { set_collection } from '$lib/logic/ctx.svelte';
	import { init_editor } from '$lib/ui/editor/editor-context.svelte.js';

	const { data, children } = $props();

	init_editor(data.collections.students);
	set_collection(data.collections.students);
</script>

{@render children()}
