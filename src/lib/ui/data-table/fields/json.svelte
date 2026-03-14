<script lang="ts">
	const { row, name } = $props();

	function format_json(val: any): string {
		if (val === null || val === undefined || val === '') return '';
		if (typeof val === 'object') {
			return JSON.stringify(val, null, 2);
		}
		try {
			const cleaned =
				typeof val === 'string'
					? val.replace(/\u00A0/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '')
					: String(val);
			return JSON.stringify(JSON.parse(cleaned), null, 2);
		} catch {
			return typeof val === 'string' ? val : String(val);
		}
	}
	let display = $state(format_json(row[name]));
	$effect(() => {
		display = format_json(row[name]);
	});
</script>

<div class="truncate text-ellipsis">
	{display}
</div>
