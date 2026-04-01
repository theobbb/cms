<script lang="ts">
	import type { BookmarkTagGroupsRecord } from '$lib/pocketbase.types';
	import type { DrawerCtx } from '$lib/types';
	import DataTable from '$lib/ui/data-table/data-table.svelte';
	import DrawerForm from '$lib/ui/data-table/drawer/drawer-form.svelte';
	import type { FieldRelation } from '$lib/ui/data-table/drawer/field.types';
	import type { ExpandedBookmarkTagsRecord } from './types';

	const { data } = $props();

	const { tags } = $derived(data);
</script>

{#snippet color(role: ExpandedBookmarkTagsRecord)}
	<div class="size-5 rounded-full" style="background-color: {role.color};"></div>
{/snippet}

<DataTable
	data={tags}
	columns={[
		{ key: 'name', label: 'nom' },
		{ key: 'parent', label: 'Parent', type: 'relation' },
		{ key: 'color', label: 'couleur', snippet: color },
		{ key: 'bookmark_count', label: 'liens' }
	]}
	{drawer}
/>

{#snippet drawer(ctx: DrawerCtx<ExpandedBookmarkTagsRecord>)}
	<DrawerForm
		fields={[
			{
				name: 'name',
				label: 'nom',
				type: 'string',
				required: true,
				min_length: 1,
				max_length: 100
			},
			{
				name: 'color',
				label: 'couleur',
				type: 'color',
				required: true
			},
			{
				name: 'parent',
				label: 'parent',
				type: 'relation',
				collection: 'bookmark_tag_groups',
				count: 'tag_count',
				display_key: 'name',
				expand: ctx?.target?.expand?.parent
			} satisfies FieldRelation<ExpandedBookmarkTagsRecord, BookmarkTagGroupsRecord>
		]}
		title="Tags"
		collection="bookmark_tags"
		{ctx}
	></DrawerForm>
{/snippet}
