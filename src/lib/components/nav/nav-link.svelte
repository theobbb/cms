<script lang="ts">
	import { page } from '$app/state';

	type Link = {
		name: string;
		href: string;
		icon?: string;
	};

	const { name, href, icon = 'icon-[ri--folder-2-line]' }: Link & { base_path?: string } = $props();

	//const href = $derived(['', base_path, slug].filter(Boolean).join('/'));
	const active = $derived(page.url.pathname === href);
</script>

<a
	class={[
		'flex items-center gap-2 truncate px-2.5 py-1 whitespace-nowrap',
		active ? 'bg-accent' : 'hover:bg-accent/30'
	]}
	{href}
>
	<div class={['shrink-0', icon]}></div>
	{name}
</a>
