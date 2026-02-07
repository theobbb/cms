<script>
	const { row, name } = $props();
</script>

<div class="flex items-center text-xl">
	{#if row[name]}
		<span class="icon-[ri--toggle-fill]"></span>
	{:else}
		<span class="text-2 icon-[ri--toggle-line]"></span>
	{/if}
</div>
