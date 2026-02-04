<script lang="ts">
	import type { PaginationResult } from '$lib/types';
	import { page as page_state } from '$app/state';

	const { pagination, route: custom_route }: { pagination: PaginationResult<any>; route?: string } =
		$props();

	const { page, perPage, totalItems, totalPages } = $derived(pagination);

	const N_LINKS = 5;

	const range = $derived.by(() => {
		// 1. Determine how many links we can actually show
		const count = Math.min(N_LINKS, totalPages);

		// 2. Ideal start to keep current page centered
		let start = page - Math.floor(count / 2);

		// 3. Clamp start so we don't go below 1 or exceed totalPages
		start = Math.max(1, Math.min(start, totalPages - count + 1));

		// 4. Return an array of page numbers
		return Array.from({ length: count }, (_, i) => start + i);
	});

	const route = $derived(custom_route || page_state.route.id);
</script>

<div class="min-w-72- grid w-fit grid-cols-7 gap-x-1.5 font-serif">
	<div class="flex items-center justify-center gap-1 text-xl">
		{#if page > 1}
			<!-- <a href="{route}?page=1" class="link-hover ">
				<IconChevronLeftDouble />
			</a> -->
			<a href="{route}?page={page - 1}" class="link-hover py-0.5">
				<span class="icon-[ri--arrow-drop-left-line]"></span>
			</a>
		{:else}
			<!-- <div class="text-2"><IconChevronLeftDouble /></div> -->
			<div class="text-2"><span class="icon-[ri--arrow-drop-left-line]"></span></div>
		{/if}
	</div>

	{#each range as p}
		<a
			class={[
				'border- px-1.5- link-hover w-fit py-0.5 text-center',
				page == p ? 'link-active' : 'text-2'
			]}
			href="{route}?page={p}"
		>
			{p}
		</a>
	{/each}

	<div class="flex items-center justify-center gap-1 text-xl">
		{#if page < totalPages}
			<a href="{route}?page={page + 1}" class="link-hover">
				<span class="icon-[ri--arrow-drop-right-line]"></span>
			</a>
			<!-- <a href="{route}?page={totalPages}" class="link-hover">
				<IconChevronRightDouble />
			</a> -->
		{:else}
			<div class="text-2"><span class="icon-[ri--arrow-drop-right-line]"></span></div>
			<!-- <div class="text-2"><IconChevronRightDouble /></div> -->
		{/if}
	</div>
</div>
