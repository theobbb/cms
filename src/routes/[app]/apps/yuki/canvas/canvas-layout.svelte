<script lang="ts">
	import { page } from '$app/state';
	import ImageComponent from '$lib/components/media/image.svelte';
	import Section from '$lib/components/section.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import type { RecordModel } from 'pocketbase';
	import { file_is_audio } from '$lib/utils/files.js';
	import AudioWaveform from '$lib/ui/components/audio-waveform.svelte';
	import Media from '$lib/components/media.svelte';
	import ListItem from '$lib/ui/components/list-item.svelte';
	import LivePosition from './live-position.svelte';
	import Drawer from './drawer.svelte';
	import { CanvasManager } from './canvas-manager.svelte';
	import SortableList from '$lib/ui/components/sortable-list.svelte';
	import type { Snippet } from 'svelte';

	const { canvas, children }: { canvas: CanvasManager; children: Snippet } = $props();

	const collection = $derived(canvas.collection);

	const context_menu_buttons = [
		{
			label: `Avancer d'un plan`,
			icon: 'icon-[ri--add-line]',
			onclick: () => canvas.change_z_index('forward')
		},
		{
			label: `Reculer d'un plan`,
			icon: 'icon-[ri--subtract-line]',
			onclick: () => canvas.change_z_index('backward')
		},
		{
			label: `Mettre au premier plan`,
			icon: 'icon-[ri--bring-forward]',
			onclick: () => canvas.change_z_index('front')
		},
		{
			label: `Mettre en arrière-plan`,
			icon: 'icon-[ri--send-backward]',
			onclick: () => canvas.change_z_index('back')
		},
		{
			label: `Supprimer`,
			icon: 'icon-[ri--garbage-bin-line]',
			onclick: (p: RecordModel | null) => canvas.confirm_delete(p?.id || '')
		}
	];
</script>

<svelte:window
	onclick={canvas.close_context_menu}
	onscroll={canvas.close_context_menu}
	onkeydown={canvas.handle_keydown}
	onpointerdown={canvas.handle_global_pointerdown}
/>

<Section size="full">
	<div class="grid w-full grid-cols-7 gap-4">
		<!-- ── LEFT PANEL: thumbnail strip ──────────────────────────────────── -->
		<div class="relative">
			<div class="sticky top-0 h-[90svh] overflow-y-auto">
				<SortableList items={canvas.sorted_items} multiple on_reorder={canvas.on_reorder}>
					{#snippet children(item, i)}
						<ListItem
							class={[
								'w-16',
								canvas.hovered_item?.id == item.id ? ' bg-accent!' : '',
								'hover:bg-white/10'
							]}
						>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class=""
								onclick={() => canvas.select_from_sidebar(item)}
								oncontextmenu={(e) => canvas.open_context_menu(e, item)}
							>
								<div class="flex max-w-md min-w-0 flex-1 items-center gap-4">
									<Media
										src="{canvas.app.pocketbase
											.url}/api/files/{collection.name}/{item.id}/{item.file}"
										alt="media-{i}"
										thumbnail
									/>
								</div>
							</div>
						</ListItem>
					{/snippet}
				</SortableList>
			</div>
		</div>

		<!-- ── CANVAS ────────────────────────────────────────────────────────── -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->

		{@render children()}

		<!-- ── RIGHT PANEL ───────────────────────────────────────────────────── -->
		<div class="-col-end-1">
			<div class="flex flex-col items-end gap-2">
				<Button onclick={() => canvas.editor.open({ method: 'create' })}>+ Nouveau</Button>
				<Button onclick={canvas.process_layout}>Traiter le layout</Button>
				<div class="mt-2 flex gap-1">
					<Button
						onclick={canvas.undo}
						disabled={!canvas.can_undo}
						tooltip="Annuler (Ctrl+Z)"
						icon="icon-[ri--arrow-go-back-line]"
					/>
					<Button
						onclick={canvas.redo}
						disabled={!canvas.can_redo}
						tooltip="Rétablir (Ctrl+Y)"
						icon="icon-[ri--arrow-go-forward-line]"
					/>
				</div>

				{#if canvas.selected_item}
					<LivePosition active={canvas.selected_item} />
				{/if}
			</div>
		</div>
	</div>
</Section>

<!-- Context menu -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if canvas.context_menu.show}
	<div
		class="border-surface-200 fixed z-9999 flex w-56 flex-col overflow-hidden rounded-md border bg-background py-1 shadow-2xl"
		style="left: {canvas.context_menu.x}px; top: {canvas.context_menu.y}px;"
		onpointerdown={(e) => e.stopPropagation()}
	>
		{#each context_menu_buttons as { label, icon, onclick }}
			<Button
				class="hover:bg-surface-100 justify-left! flex items-center gap-2 px-3 py-2 text-left! text-sm"
				onclick={() => onclick(canvas.context_menu.item)}
			>
				<div class="justify-left flex w-full items-center gap-2">
					<span class={icon}></span>
					<div>{label}</div>
				</div>
			</Button>
		{/each}
	</div>
{/if}

{#if canvas.editor.current != null && page.url.searchParams.has('editor')}
	<Drawer items={canvas.sorted_items} {collection} />
{/if}
