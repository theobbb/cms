<script lang="ts">
	import type { Collection } from '$config/types';
	import { get_app } from '$lib/logic/ctx.svelte';

	const { record, collection }: { record: any; collection?: string | Collection<any> } = $props();

	const app = get_app();
	const name = $derived.by(() => {
		if (!record) return 'null';
		const display_key =
			typeof collection == 'string'
				? app.collections[collection]?.display_key
				: collection?.display_key;
		if (display_key) {
			if (display_key in record) return record?.[display_key];

			const multiple = display_key.split('+');
			if (multiple?.length) {
				return multiple
					.map((key) => record[key])
					.filter((val) => val !== undefined && val !== null && val !== '')
					.join(' ');
			}
		}
		return record.name || record.title || record.first_name || record.id || '';
	});
</script>

{name}
