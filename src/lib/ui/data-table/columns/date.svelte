<script>
	import { format_date } from '$lib/utils/format-date';

	const { row, key } = $props();
</script>

<div class="markdown truncate text-ellipsis">
	{format_date(row[key])}
</div>
