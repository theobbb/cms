<script lang="ts">
	import { page } from '$app/state';
	import ImageComponent from '$lib/components/media/image.svelte';
	import Section from '$lib/components/section.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte.js';
	import { EditorCollectionList } from '$lib/ui/data-table/collection-list.svelte';
	import { init_editor } from '$lib/ui/editor/editor-context.svelte';
	import type { RecordModel } from 'pocketbase';
	import PostEditor from './post-editor.svelte';
	import { use_pocketbase } from '$lib/pocketbase.js';
	import { confirm } from '$lib/logic/confirm.svelte.js';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte.js';
	import SortableList from '$lib/ui/components/sortable-list.svelte';
	import ListItem from '$lib/ui/components/list-item.svelte';
	import FileAttachment from '$lib/ui/editor/fields/file-attachment.svelte';
	import { file_is_audio } from '$lib/utils/files.js';
	import AudioWaveform from '$lib/ui/components/audio-waveform.svelte';
	import Media from '$lib/components/media.svelte';
	import { get_app } from '$lib/logic/ctx.svelte.js';

	const { data } = $props();

	const collection = $derived(data.collections.posts);
	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const list = new EditorCollectionList(collection, { sort: '-sort_order' });
	const editor = init_editor(collection);
	const app = get_app();

	const pop_edit = new Pop();
	$effect(() => {
		if (editor.current != null && page.url.searchParams.has('editor')) {
			pop_edit.show();
		}
	});

	let context_menu = $state({
		show: false,
		x: 0,
		y: 0,
		item: null as RecordModel | null
	});

	function open_context_menu(e: MouseEvent, item: RecordModel) {
		e.preventDefault(); // Stop the default browser right-click menu
		e.stopPropagation();
		context_menu = {
			show: true,
			x: e.clientX,
			y: e.clientY,
			item: item
		};
	}

	function close_context_menu() {
		context_menu.show = false;
	}

	async function change_z_index(action: 'forward' | 'backward' | 'front' | 'back') {
		const item = context_menu.item;
		if (!item) return;

		let new_z = item.z_index || 0;

		if (action === 'forward') {
			new_z += 1;
		} else if (action === 'backward') {
			new_z -= 1;
		} else if (action === 'front') {
			// Find the highest z-index currently on the canvas, add 1
			const max_z = Math.max(...sorted_items.map((i) => i.z_index || 0));
			new_z = max_z + 1;
		} else if (action === 'back') {
			// Find the lowest z-index currently on the canvas, subtract 1
			const min_z = Math.min(...sorted_items.map((i) => i.z_index || 0));
			new_z = min_z - 1;
		}

		item.z_index = new_z;
		close_context_menu(); // Hide menu immediately for snappy UI

		await pocketbase.collection('posts').update(item.id, { z_index: new_z });
	}

	// --- INTERACTIVE CANVAS STATE ---
	let canvas_ref: HTMLElement | undefined = $state();
	let dragging_item: RecordModel | null = $state(null);
	let resizing_item: RecordModel | null = $state(null);
	let margin_top_item: RecordModel | null = $state(null);
	let margin_bottom_item: RecordModel | null = $state(null);
	let drag_rect: DOMRect | null = null;

	let hovered_item: RecordModel | null = $state(null);

	// Derive sorted items so they stack correctly in the DOM
	const sorted_items = $derived(
		[...list.items].sort((a, b) => {
			const sortA = a.sort_order ?? 0;
			const sortB = b.sort_order ?? 0;
			return sortA - sortB;
		})
	);

	async function on_reorder(new_order: RecordModel[]) {
		// Assign new sort_order values spaced by 10
		const updates = new_order.map((item, i) => {
			const new_sort = (i + 1) * 10;
			item.sort_order = new_sort;
			return pocketbase
				.collection('posts')
				.update(item.id, { sort_order: new_sort }, { requestKey: null });
		});
		await Promise.all(updates);
	}

	// --- 1. SORT ORDER LOGIC ---
	async function normalize_sort_orders() {
		const updates = [];
		for (let i = 0; i < sorted_items.length; i++) {
			const item = sorted_items[i];
			const new_sort = (i + 1) * 10; // Spaced by 10: 10, 20, 30...
			if (item.sort_order !== new_sort) {
				item.sort_order = new_sort;
				updates.push(
					pocketbase
						.collection('posts')
						.update(item.id, { sort_order: new_sort }, { requestKey: null })
				);
			}
		}
		if (updates.length) await Promise.all(updates);
	}

	async function move_layer(item: RecordModel, direction: -1 | 1) {
		// THE FIX: Check for ANY duplicates or invalid numbers, not just "all identical"
		const has_duplicates =
			new Set(sorted_items.map((i) => i.sort_order)).size !== sorted_items.length;
		const has_invalid = sorted_items.some((i) => typeof i.sort_order !== 'number');

		if (has_duplicates || has_invalid) await normalize_sort_orders();

		// Recalculate index based on potentially fresh normalization
		const current_sorted = [...list.items].sort(
			(a, b) => (a.sort_order || 0) - (b.sort_order || 0)
		);
		const current_idx = current_sorted.findIndex((i) => i.id === item.id);
		const target_idx = current_idx + direction;

		if (target_idx >= 0 && target_idx < current_sorted.length) {
			const target_item = current_sorted[target_idx];

			// Swap their values
			const temp = item.sort_order;
			item.sort_order = target_item.sort_order;
			target_item.sort_order = temp;

			// Save to DB in background
			Promise.all([
				pocketbase.collection('posts').update(item.id, { sort_order: item.sort_order }),
				pocketbase
					.collection('posts')
					.update(target_item.id, { sort_order: target_item.sort_order })
			]);
		}
	}

	// --- 2. DRAG LOGIC (Translate Offset) ---
	function start_drag(e: PointerEvent, item: RecordModel) {
		e.preventDefault();
		const target = e.currentTarget as HTMLElement;
		target.setPointerCapture(e.pointerId);
		dragging_item = item;

		const wrapper = target.closest('.draggable-wrapper');
		if (wrapper) {
			drag_rect = wrapper.getBoundingClientRect();
		}
	}

	function on_drag(e: PointerEvent) {
		if (!dragging_item || !drag_rect) return;
		// Convert pixel movement to percentages of the ELEMENT's size
		const dx_pct = (e.movementX / drag_rect.width) * 100;
		const dy_pct = (e.movementY / drag_rect.height) * 100;

		dragging_item.left = (dragging_item.left || 0) + dx_pct;
		dragging_item.top = (dragging_item.top || 0) + dy_pct;
	}

	async function stop_drag(e: PointerEvent) {
		if (dragging_item) {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			const item = dragging_item;
			dragging_item = null;
			drag_rect = null;
			await pocketbase.collection('posts').update(item.id, { left: item.left, top: item.top });
		}
	}

	// --- 3. RESIZE LOGIC (Width) ---
	function start_resize(e: PointerEvent, item: RecordModel) {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		resizing_item = item;
	}

	function on_resize(e: PointerEvent) {
		if (!resizing_item || !canvas_ref) return;
		const rect = canvas_ref.getBoundingClientRect();
		const dx_pct = (e.movementX / rect.width) * 100;
		resizing_item.width = Math.min(100, Math.max(5, (resizing_item.width || 20) + dx_pct));
	}

	async function stop_resize(e: PointerEvent) {
		if (resizing_item) {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			const item = resizing_item;
			resizing_item = null;
			await pocketbase.collection('posts').update(item.id, { width: item.width });
		}
	}

	// --- 4. MARGIN LOGIC (Top / Bottom) ---
	function start_margin_top(e: PointerEvent, item: RecordModel) {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		margin_top_item = item;
	}

	function start_margin_bottom(e: PointerEvent, item: RecordModel) {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		margin_bottom_item = item;
	}

	function on_margin(e: PointerEvent) {
		if (!canvas_ref) return;
		const rect = canvas_ref.getBoundingClientRect();
		// CSS vertical margins (%) are based on the PARENT'S width, not height.
		const dy_pct = (e.movementY / rect.width) * 100;

		if (margin_top_item) {
			margin_top_item.margin_top = (margin_top_item.margin_top || 0) + dy_pct;
		} else if (margin_bottom_item) {
			margin_bottom_item.margin_bottom = (margin_bottom_item.margin_bottom || 0) + dy_pct;
		}
	}

	async function stop_margin(e: PointerEvent) {
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		if (margin_top_item) {
			const item = margin_top_item;
			margin_top_item = null;
			await pocketbase.collection('posts').update(item.id, { margin_top: item.margin_top });
		}
		if (margin_bottom_item) {
			const item = margin_bottom_item;
			margin_bottom_item = null;
			await pocketbase.collection('posts').update(item.id, { margin_bottom: item.margin_bottom });
		}
	}

	async function process_layout() {
		if (!canvas_ref) return;

		const canvas_rect = canvas_ref.getBoundingClientRect();
		const scale = 120 / canvas_rect.width;
		const out_width = 120;
		const out_height = Math.round(canvas_rect.height * scale);

		const oc = new OffscreenCanvas(out_width, out_height);
		const ctx = oc.getContext('2d')!;

		// Load and draw each image
		await Promise.all(
			sorted_items
				.filter((item) => item.file)
				.map((item) => {
					return new Promise<void>((resolve) => {
						// Build the same URL your <Image> component uses
						const url = pocketbase.files.getURL(item, item.file, { thumb: '600x0' });
						const img = new Image();
						img.crossOrigin = 'anonymous';
						img.onload = () => {
							// Find the rendered DOM element to get its real position
							const el = canvas_ref!.querySelector(`[data-id="${item.id}"]`);
							if (!el) return resolve();
							const el_rect = (el as HTMLElement).getBoundingClientRect();

							const x = (el_rect.left - canvas_rect.left) * scale;
							const y = (el_rect.top - canvas_rect.top) * scale;
							const w = el_rect.width * scale;
							const h = el_rect.height * scale;

							ctx.drawImage(img, x, y, w, h);
							resolve();
						};
						img.onerror = () => resolve(); // skip broken images
						img.src = url;
					});
				})
		);

		const blob = await oc.convertToBlob({ type: 'image/png' });

		const globals = await pocketbase.collection('globals').getFirstListItem('');

		if (!globals?.id) {
			toaster.push('error', 'Globals introuvable');
			return;
		}

		const form = new FormData();
		form.append('layout', blob, 'layout.png');
		await pocketbase.collection('globals').update(globals.id, form);
		toaster.push('success', 'Layout enregistré');
	}

	async function confirm_delete(post_id: string) {
		if (!post_id) return;
		const confirmed = await confirm('Supprimer cette sélection ?');
		if (!confirmed) return;

		await pocketbase.collection('posts').delete(post_id);
		toaster.push('success', 'Post supprimé');
	}

	const context_menu_buttons = [
		{
			label: `Avancer d'un plan`,
			icon: 'icon-[ri--add-line]',
			onclick: () => change_z_index('forward')
		},
		{
			label: `Reculer d'un plan`,
			icon: 'icon-[ri--subtract-line]',
			onclick: () => change_z_index('backward')
		},
		{
			label: `Mettre au premier plan`,
			icon: 'icon-[ri--bring-forward]',
			onclick: () => change_z_index('front')
		},
		{
			label: `Mettre en arrière-plan`,
			icon: 'icon-[ri--send-backward]',
			onclick: () => change_z_index('back')
		},
		{
			label: `Supprimer`,
			icon: 'icon-[ri--garbage-bin-line]',
			onclick: (post: RecordModel | null) => confirm_delete(post?.id || '')
		}
	];
</script>

<svelte:window onclick={close_context_menu} onscroll={close_context_menu} />

<!-- svelte-ignore a11y_no_static_element_interactions -->

<Section size="full" class="">
	<div class="grid w-full grid-cols-5">
		<div class="relative">
			<div class="sticky top-0 h-[80svh] overflow-y-auto">
				<SortableList items={sorted_items} multiple {on_reorder}>
					{#snippet children(item, i)}
						<ListItem
							class={[hovered_item?.id == item.id ? 'bg-accent!' : '', 'hover:bg-white/10']}
						>
							<div class={['-ml-2 max-w-full']}>
								<!-- <FileAttachment file={item.file} record_id={item.id} collection="posts" /> -->
							</div>
							<div class="">
								<div class="flex max-w-md min-w-0 flex-1 items-center gap-4">
									<Media
										src="{app.pocketbase.url}/api/files/posts/{item.id}/{item.file}"
										alt="media-{i}"
										thumbnail
									/>
									{item.file}
								</div>
							</div>
						</ListItem>
					{/snippet}
				</SortableList>
			</div>
		</div>
		<div
			bind:this={canvas_ref}
			class="col-span-3 mx-auto mt-8 flex w-xl flex-col items-center border bg-surface"
		>
			{#each sorted_items as item, i (item.id)}
				{#if item.file}
					<div
						class="draggable-wrapper group hover:border-surface-300 relative cursor-grab border-2 border-transparent transition-colors active:cursor-grabbing"
						style="
							transform: translate({item.left || 0}%, {item.top || 0}%); 
							width: {item.width || 50}%; 
							margin-top: {item.margin_top || 0}%;
							margin-bottom: {item.margin_bottom || 0}%;
							z-index: {item.z_index + 50 || 0};
						"
						data-id={item.id}
						onpointerdown={(e) => start_drag(e, item)}
						onpointermove={on_drag}
						onpointerup={stop_drag}
						onpointercancel={stop_drag}
						oncontextmenu={(e) => open_context_menu(e, item)}
						onmouseenter={() => (hovered_item = item)}
						onmouseleave={() => (hovered_item = null)}
					>
						<div style="aspect-ratio: {item.aspect_ratio}; width: 100%;" class="relative">
							<button
								class="absolute -top-3 left-1/2 z-50 h-4 w-16 -translate-x-1/2 cursor-ns-resize rounded-full bg-green-500 opacity-0 shadow transition-all group-hover:opacity-100 hover:scale-110 active:opacity-100"
								onpointerdown={(e) => start_margin_top(e, item)}
								onpointermove={on_margin}
								onpointerup={stop_margin}
								onpointercancel={stop_margin}
								title="Ajuster la marge haute"
							></button>
							{#if file_is_audio(item.file) && item.audio_meta}
								<AudioWaveform meta={item.audio_meta} />
							{:else}
								<ImageComponent
									record_id={item.id}
									filename={item.file}
									collection="posts"
									size="600x0"
									class="pointer-events-none select-none not-group-hover:opacity-80"
								/>
							{/if}
							<button
								class="absolute -bottom-3 left-1/2 z-50 h-4 w-16 -translate-x-1/2 cursor-ns-resize rounded-full bg-green-500 opacity-0 shadow transition-all group-hover:opacity-100 hover:scale-110 active:opacity-100"
								onpointerdown={(e) => start_margin_bottom(e, item)}
								onpointermove={on_margin}
								onpointerup={stop_margin}
								onpointercancel={stop_margin}
								title="Ajuster la marge basse"
							></button>

							<div
								class="absolute -top-10 left-0 z-50 flex cursor-auto gap-1 rounded bg-background p-1 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
								onpointerdown={(e) => e.stopPropagation()}
							>
								<div>
									<Button
										onclick={() => move_layer(item, -1)}
										disabled={i === 0}
										tooltip="Monter"
										icon="icon-[ri--arrow-up-line]"
									/>
								</div>
								<div>
									<Button
										tooltip="Descendre"
										icon="icon-[ri--arrow-down-line]"
										onclick={() => move_layer(item, 1)}
										disabled={i === sorted_items.length - 1}
									/>
								</div>
								<div class="bg-surface-200 mx-1 w-px"></div>
								<div>
									<Button
										tooltip="Éditer"
										icon="icon-[ri--pencil-fill]"
										onclick={() => editor.open({ method: 'update', record: item })}
									/>
								</div>
							</div>

							<button
								class="absolute -right-2 -bottom-2 z-50 size-4 cursor-nwse-resize rounded-full bg-blue-500 opacity-0 shadow transition-all group-hover:opacity-100 hover:scale-125 active:opacity-100"
								onpointerdown={(e) => start_resize(e, item)}
								onpointermove={on_resize}
								onpointerup={stop_resize}
								onpointercancel={stop_resize}
								title="Redimensionner"
							></button>
						</div>
					</div>
				{/if}
			{/each}
		</div>
		<div>
			<div class="flex justify-end gap-2">
				<Button onclick={process_layout}>Traiter le layout</Button>
				<Button onclick={() => editor.open({ method: 'create' })}>+ Nouveau</Button>
			</div>
		</div>
	</div>
</Section>
<!-- svelte-ignore a11y_no_static_element_interactions -->

{#if context_menu.show}
	<div
		class="border-surface-200 fixed z-9999 flex w-56 flex-col overflow-hidden rounded-md border bg-background py-1 shadow-2xl"
		style="left: {context_menu.x}px; top: {context_menu.y}px;"
		onpointerdown={(e) => e.stopPropagation()}
	>
		{#each context_menu_buttons as { label, icon, onclick }}
			<Button
				class="hover:bg-surface-100 justify-left! flex items-center gap-2 px-3 py-2 text-left! text-sm"
				onclick={() => onclick(context_menu.item)}
			>
				<div class="justify-left flex w-full items-center gap-2">
					<span class={icon}></span>
					<div>{label}</div>
				</div>
			</Button>
		{/each}
	</div>
{/if}

{#if editor.current != null && page.url.searchParams.has('editor')}
	<PostEditor items={sorted_items} />
{/if}
