<script lang="ts">
	import type { BookmarkTagGroupsRecord, BookmarkTagsRecord } from '$lib/pocketbase.types';
	import type { DrawerCtx } from '$lib/types';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import DrawerForm from '$lib/ui/data-table/drawer/drawer-form.svelte';

	const { data } = $props();

	const { tag_groups_list } = $derived(data);
</script>

<DataTable
	data={tag_groups_list}
	columns={[
		{ key: 'name', label: 'nom' },
		{ key: 'tag_count', label: 'tags' }
	]}
	{drawer}
/>

{#snippet drawer(ctx: DrawerCtx<BookmarkTagGroupsRecord>)}
	<DrawerForm
		fields={[
			{
				name: 'name',
				label: 'nom',
				type: 'string',
				required: true,
				min_length: 1,
				max_length: 100
			}

			// {
			// 	name: 'color',
			// 	label: 'couleur',
			// 	type: 'color',
			// 	required: true
			// }
		]}
		title="Tags Groupes"
		collection="bookmark_tag_groups"
		{ctx}
	></DrawerForm>
{/snippet}
