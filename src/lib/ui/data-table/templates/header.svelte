<script>
	import { get_collection } from '$lib/logic/ctx.svelte';
	import Button from '$lib/ui/button.svelte';
	import { use_editor } from '$lib/ui/editor/editor-context.svelte';
	import Search from '$lib/ui/form/search.svelte';

	const collection = get_collection();
	const editor = use_editor();
</script>

<div class="grid grid-cols-[auto_1fr_auto] items-center gap-8">
	<div class="capitalize">{collection.name}</div>
	<div class="w-full"><Search url_param="search" /></div>

	<Button onclick={() => editor.open({ type: 'create', collection })}>+ Nouveau</Button>
</div>
