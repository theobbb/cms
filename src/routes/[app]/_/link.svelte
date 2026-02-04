<script lang="ts">
	import { page } from '$app/state';
	import type { App, TreeItem } from '$config/types';
	import { get_params } from './ctx.svelte';

	const { item }: { item: TreeItem } = $props();

	const active = $derived(page.params.schema?.startsWith(item.path || ''));

	const parent_params = get_params();
	const parent_path = parent_params.join('/');
</script>

<div class="block">
	<a
		class={[
			'-mx-1.5 flex items-center gap-2 px-1.5 py-0.5',
			active ? 'bg-active' : 'hover:bg-active/30'
		]}
		href="/{parent_path}/{item.param}"
	>
		<span class="icon-[ri--folder-2-line]"></span>
		{item.name}
	</a>
</div>
