<script lang="ts">
	import { set_data_store } from '$lib/logic/data.svelte';
	import { init_editor } from '$lib/logic/editor.svelte';

	const { children } = $props();

	set_data_store();
</script>

<div class="flex divide-x">
	{@render children()}
</div>
