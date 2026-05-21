<script>
	const { row, name } = $props();
</script>

<div class="truncate text-ellipsis">
	<div class="size-4 rounded-full" style="background: {row[name]};"></div>
</div>
