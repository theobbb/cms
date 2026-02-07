<script lang="ts">
	import { page } from '$app/state';

	type Link = {
		name: string;
		param: string;
	};

	const { name, param, base_path = '' }: Link & { base_path?: string } = $props();

	const href = $derived(
		'/' + [page.params.app, base_path, param].filter((i) => Boolean(i)).join('/')
	);

	const active = $derived(page.url.pathname.startsWith(href));
</script>

<div class="block">
	<a
		class={[
			'-mx-1.5 flex items-center gap-1.5 truncate px-1.5 py-0.5 whitespace-nowrap',
			active ? 'bg-active' : 'hover:bg-active/30'
		]}
		{href}
	>
		<div class="icon-[ri--folder-2-line] shrink-0"></div>
		{name}
	</a>
</div>

<!-- <div>
	<a {href} class={[active && 'active']}>
		{name}
	</a>
</div> -->
