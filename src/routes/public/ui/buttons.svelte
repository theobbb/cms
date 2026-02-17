<script lang="ts">
	import Button from '$lib/ui/button.svelte';

	const sizes = ['sm', 'md', 'lg'];
	const variants = ['base', 'action', 'discrete', 'danger', 'ghost', 'none'];
	const states = ['default', 'hover', 'pressed', 'focus', 'disabled'];
</script>

<div class="mx-auto my-10 w-fit px-12">
	<div class="grid w-fit grid-cols-3 gap-4">
		{#each sizes as size}
			<div class="row-span-6 text-sm">
				{size}
			</div>

			{#each variants as variant}
				<div><Button {size} {variant}>This is a button</Button></div>
				<div><Button disabled {size} {variant}>This is a button</Button></div>
			{/each}
			<div class="col-span-full h-6"></div>
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
