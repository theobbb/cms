<script lang="ts">
	import Button from '$lib/ui/button.svelte';

	const sizes = ['sm', 'md', 'lg'];
	const variants = ['default', 'action', 'discrete', 'danger', 'ghost', 'none'];
	const states = ['default', 'hover', 'active', 'focus', 'focus-visible', 'loading', 'disabled'];
</script>

<div class="text-sm">
	<div class="mb-8 grid grid-cols-8 gap-4">
		<div></div>
		{#each states as state}
			<div class="sticky top-0">{state}</div>
		{/each}
		{#each { length: 2 } as _, type_i}
			{#each sizes as size}
				<div class="col-span-full text-sm">
					{size}
				</div>

				{#each variants as variant}
					<div class="text-sm">{variant}</div>
					{#each states as state}
						<div>
							<Button
								{size}
								{variant}
								class={state}
								disabled={state == 'disabled'}
								loading={state == 'loading'}
								icon={type_i == 1 ? 'icon-[ri--menu-line]' : ''}
							>
								{#if type_i != 1}
									This is a button
								{/if}
							</Button>
						</div>
					{/each}
					<!-- <div class="flex justify-end">
					<Button {size} {variant} icon="icon-[ri--external-link-fill]"></Button>
				</div>
				<div><Button disabled {size} {variant} icon="icon-[ri--external-link-fill]"></Button></div> -->
				{/each}
				<div class="col-span-full h-6"></div>
			{/each}
		{/each}
	</div>

	<div class="mt-8 grid w-fit grid-cols-2 gap-2">
		{#each sizes as size}
			<div class="text-2 col-span-full mt-6 text-sm">
				{size}
			</div>
			{#each variants as variant}
				<div><Button {size} {variant} icon="icon-[ri--external-link-fill]"></Button></div>
				<div><Button disabled {size} {variant} icon="icon-[ri--external-link-fill]"></Button></div>
			{/each}
		{/each}
	</div>
</div>
