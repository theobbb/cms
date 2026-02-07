<script>
	import { format_date } from '$lib/utils/format-date';

	const { row, name } = $props();
</script>

<div class="markdown truncate text-ellipsis">
	{format_date(row[name])}
</div>
