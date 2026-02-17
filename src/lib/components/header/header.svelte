<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/ui/button.svelte';
	import Select from '$lib/ui/pop/select.svelte';
	import { use_header } from './header-manager.svelte';

	const { user } = $derived(page.data);

	const header = use_header();
	header.push_start({
		name: 'Data',
		icon: 'icon-[ri--folder-2-line]',
		href: `/`
	});
	header.push_start({
		name: 'Users',
		icon: 'icon-[ri--group-line]',
		href: `/users`
	});
</script>

<header class="flex h-header items-center justify-between border-b px-gap">
	<div class="flex items-center gap-gap">
		{#each header.start_items as item}
			{#if 'href' in item}
				<a href={item.href} class="flex items-center gap-1.5">
					<div class={item.icon}></div>
					{item.name}
				</a>
			{:else}
				<div>
					<select onchange={(e) => goto('/' + e.target?.value)}>
						<!-- {item.name} -->
						{#each item.options as option}
							<option value={option}>
								{option}
							</option>
						{/each}
					</select>
				</div>
			{/if}
		{/each}
		<!-- <a href="/{page.params.app}" class="flex items-center gap-1.5">
			<div class="icon-[ri--folder-2-line]"></div>
			Data
		</a>
		<a href="/{page.params.app}/users" class="flex items-center gap-1.5">
			<div class="icon-[ri--group-line]"></div>
			Users
		</a> -->
		<!-- <a href="/{page.params.app}/users" class="flex items-center gap-1.5">
			<div class="icon-[ri--bug-line]"></div>
			Bug
		</a> -->
		<!-- <a href="/{page.params.app}"></a>
		<a href="/{page.params.app}">Data</a> -->
		<!-- <a class="icon-[ri--folder-2-line]" title="bug report"></a>
		<a class="icon-[ri--bug-line]" title="bug report"></a>
		<a href="/{page.params.app}/users" class="icon-[ri--group-line]" title="users"></a> -->
		<!-- <a href="/{page.params.app}/stats" class="icon-[ri--line-chart-line]" title="stats"></a>
		<a href="/{page.params.app}/info" class="icon-[ri--file-info-line]" title="info"></a> -->
		<!-- <div>Membres</div>
		<div>Données</div>
		<div>Facturation</div> -->
	</div>
	<a href="/profile" class="flex items-center gap-1">
		<span class="icon-[ri--user-line]"></span>
		{user?.name}
	</a>
</header>
