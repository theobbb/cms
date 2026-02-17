<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/button.svelte';

	let items = $state([]);

	const { user } = $derived(page.data);
</script>

<header class="flex h-header items-center justify-between border-b px-gap">
	<div class="flex items-center gap-gap">
		<a href="/{page.params.app}" class="flex items-center gap-1.5">
			<div class="icon-[ri--folder-2-line]"></div>
			Data
		</a>
		<a href="/{page.params.app}/users" class="flex items-center gap-1.5">
			<div class="icon-[ri--group-line]"></div>
			Users
		</a>
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
	<a href="/{page.params.app}/profile" class="flex items-center gap-1">
		<span class="icon-[ri--user-line]"></span>
		{user?.name}
	</a>
</header>
