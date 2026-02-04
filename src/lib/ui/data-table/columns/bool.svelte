<script>
	const { row, key } = $props();
</script>

<div class="flex items-center text-xl">
	{#if row[key]}
		<span class="icon-[ri--toggle-fill]"></span>
	{:else}
		<span class="text-2 icon-[ri--toggle-line]"></span>
	{/if}
</div>
