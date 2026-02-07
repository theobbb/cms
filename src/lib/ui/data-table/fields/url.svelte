<script>
	const { row, name } = $props();
</script>

<div class="markdown truncate text-ellipsis">
	<a href={row[name]} target="_blank">{row[name]}</a>
</div>
