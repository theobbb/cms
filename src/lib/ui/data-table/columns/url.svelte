<script>
	const { row, key } = $props();
</script>

<div class="markdown truncate text-ellipsis">
	<a href={row[key]} target="_blank">{row[key]}</a>
</div>
