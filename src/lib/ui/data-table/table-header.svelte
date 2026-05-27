<script lang="ts">
	import Search from '../components/search.svelte';
	import type { EditorCollectionList } from './collection-list.svelte';
	import Button from '../components/button.svelte';
	import type { Editor } from '../editor/editor-context.svelte';
	import type { Snippet } from 'svelte';

	const {
		title,
		list,
		editor,
		action_bar
	}: { title: string; list?: EditorCollectionList; editor?: Editor; action_bar?: Snippet } =
		$props();
</script>

<header class="mt-2">
	<div class="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-8 pt-1">
		<div class=" text-xl">{title}</div>
		<div class="w-full"><Search url_param="search" /></div>
		{#if action_bar}
			{@render action_bar()}
		{:else if editor}
			<Button onclick={() => editor.open({ method: 'create' })} size="lg" variant="action">
				+ Nouveau
			</Button>
		{/if}
	</div>

	<div class="flex min-h-10 justify-between">
		{#if list}
			<div>
				{#if list.checked_set.size > 0}
					<div class="-mt-1 w-sm bg-surface px-2.5 py-2 text-surface-foreground">
						<div class="flex items-center justify-between gap-2">
							<div class="flex items-center gap-2 font-mono text-xs">
								<Button
									icon="icon-[ri--reset-left-line]"
									variant="ghost"
									onclick={() => list.checked_set.clear()}
									tooltip="Réinitialiser la sélection"
								/>
								<div class="text-muted">{list.checked_set.size} séléctionné(s)</div>
							</div>
							<Button variant="danger" onclick={() => list.delete_selection()}>Supprimer</Button>
						</div>
					</div>
				{/if}
			</div>
			<div class="mt-1 font-mono text-xs text-muted">
				Total: {list.total_items}
			</div>
		{/if}
	</div>
</header>
