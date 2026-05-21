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
	import { file_is_audio } from '$lib/utils/files.js';
	import AudioWaveform from '$lib/ui/components/audio-waveform.svelte';
	import Media from '$lib/components/media.svelte';
	import { get_app } from '$lib/logic/ctx.svelte.js';
	import ListItem from '$lib/ui/components/list-item.svelte';
	import LivePosition from './live-position.svelte';

	const { data } = $props();

	const collection = $derived(data.collections.posts);
	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	// --- HISTORY (UNDO/REDO) ---
	type HistorySnapshot = {
		id: string;
		left: number;
		top: number;
		width: number;
		margin_top: number;
		margin_bottom: number;
		z_index: number;
		sort_order: number;
	}[];

	const TRACKED_FIELDS = [
		'left',
		'top',
		'width',
		'margin_top',
		'margin_bottom',
		'z_index',
		'sort_order'
	] as const;
	const MAX_HISTORY = 50;

	let history_stack: HistorySnapshot[] = $state([]);
	let history_index = $state(-1);
	const can_undo = $derived(history_index > 0);
	const can_redo = $derived(history_index < history_stack.length - 1);

	function snapshot_items(): HistorySnapshot {
		return list.items.map((item) => ({
			id: item.id,
			left: item.left ?? 0,
			top: item.top ?? 0,
			width: item.width ?? 50,
			margin_top: item.margin_top ?? 0,
			margin_bottom: item.margin_bottom ?? 0,
			z_index: item.z_index ?? 0,
			sort_order: item.sort_order ?? 0
		}));
	}

	function push_history() {
		if (history_index < history_stack.length - 1) {
			history_stack = history_stack.slice(0, history_index + 1);
		}
		history_stack = [...history_stack, snapshot_items()];
		if (history_stack.length > MAX_HISTORY) {
			history_stack = history_stack.slice(history_stack.length - MAX_HISTORY);
		}
		history_index = history_stack.length - 1;
	}

	async function apply_snapshot(snap: HistorySnapshot) {
		const updates: Promise<unknown>[] = [];
		for (const saved of snap) {
			const item = list.items.find((i) => i.id === saved.id);
			if (!item) continue;
			let changed = false;
			for (const field of TRACKED_FIELDS) {
				if (item[field] !== saved[field]) {
					item[field] = saved[field];
					changed = true;
				}
			}
			if (changed) {
				const payload = Object.fromEntries(TRACKED_FIELDS.map((f) => [f, saved[f]]));
				updates.push(
					pocketbase.collection('posts').update(saved.id, payload, { requestKey: null })
				);
			}
		}
		await Promise.all(updates);
	}

	async function undo() {
		if (!can_undo) return;
		history_index -= 1;
		await apply_snapshot(history_stack[history_index]);
		toaster.push('success', 'Annulé');
	}

	async function redo() {
		if (!can_redo) return;
		history_index += 1;
		await apply_snapshot(history_stack[history_index]);
		toaster.push('success', 'Rétabli');
	}

	function handle_keydown(e: KeyboardEvent) {
		const tag = (e.target as HTMLElement).tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable)
			return;

		if (e.key === 'Escape') {
			selected_id = null;
			return;
		}

		const ctrl = e.ctrlKey || e.metaKey;
		if (!ctrl) return;
		if (e.key === 'z' && !e.shiftKey) {
			e.preventDefault();
			undo();
		} else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
			e.preventDefault();
			redo();
		}
	}

	$effect(() => {
		if (list.items.length > 0 && history_stack.length === 0) {
			history_stack = [snapshot_items()];
			history_index = 0;
		}
	});

	const list = new EditorCollectionList(collection, { sort: '-sort_order' });
	const editor = init_editor(collection);
	const app = get_app();

	const pop_edit = new Pop();
	$effect(() => {
		if (editor.current != null && page.url.searchParams.has('editor')) pop_edit.show();
	});

	// ─── SELECTION MODEL (Figma-like) ───────────────────────────────────────────
	let hovered_item: RecordModel | null = $state(null);
	// Source of truth is the ID; selected_item is always derived from the live list
	// so it stays valid after snapshot applies, PocketBase refreshes, and reorders.
	let selected_id: string | null = $state(null);
	const selected_item = $derived(
		selected_id != null ? (list.items.find((i) => i.id === selected_id) ?? null) : null
	);

	// Distinguishing click vs drag
	let ptr_down_x = 0;
	let ptr_down_y = 0;
	let ptr_delta = 0;
	const DRAG_THRESHOLD = 5; // px

	function select_item(item: RecordModel) {
		selected_id = item.id;
	}
	function deselect() {
		selected_id = null;
	}

	/** Select from sidebar AND scroll canvas element into view */
	function select_from_sidebar(item: RecordModel) {
		selected_id = item.id;
		const el = canvas_ref?.querySelector(`[data-id="${item.id}"]`) as HTMLElement | null;
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	// ─── CONTEXT MENU ────────────────────────────────────────────────────────────
	let context_menu = $state({ show: false, x: 0, y: 0, item: null as RecordModel | null });

	function open_context_menu(e: MouseEvent, item: RecordModel) {
		e.preventDefault();
		e.stopPropagation();
		context_menu = { show: true, x: e.clientX, y: e.clientY, item };
	}
	function close_context_menu() {
		context_menu.show = false;
	}

	async function change_z_index(action: 'forward' | 'backward' | 'front' | 'back') {
		const item = context_menu.item;
		if (!item) return;
		push_history();
		let new_z = item.z_index || 0;
		if (action === 'forward') new_z += 1;
		else if (action === 'backward') new_z -= 1;
		else if (action === 'front') new_z = Math.max(...sorted_items.map((i) => i.z_index || 0)) + 1;
		else if (action === 'back') new_z = Math.min(...sorted_items.map((i) => i.z_index || 0)) - 1;
		item.z_index = new_z;
		close_context_menu();
		await pocketbase.collection('posts').update(item.id, { z_index: new_z });
	}

	// ─── CANVAS STATE ────────────────────────────────────────────────────────────
	let canvas_ref: HTMLElement | undefined = $state();
	let dragging_item: RecordModel | null = $state(null);
	let resizing_item: RecordModel | null = $state(null);
	let margin_top_item: RecordModel | null = $state(null);
	let margin_bottom_item: RecordModel | null = $state(null);
	let drag_rect: DOMRect | null = null;

	const sorted_items = $derived(
		[...list.items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
	);

	async function on_reorder(new_order: RecordModel[]) {
		push_history();
		await Promise.all(
			new_order.map((item, i) => {
				const s = (i + 1) * 10;
				item.sort_order = s;
				return pocketbase
					.collection('posts')
					.update(item.id, { sort_order: s }, { requestKey: null });
			})
		);
	}

	async function normalize_sort_orders() {
		const updates = sorted_items.flatMap((item, i) => {
			const s = (i + 1) * 10;
			if (item.sort_order === s) return [];
			item.sort_order = s;
			return [
				pocketbase.collection('posts').update(item.id, { sort_order: s }, { requestKey: null })
			];
		});
		if (updates.length) await Promise.all(updates);
	}

	async function move_layer(item: RecordModel, direction: -1 | 1) {
		push_history();
		const has_dup = new Set(sorted_items.map((i) => i.sort_order)).size !== sorted_items.length;
		const has_bad = sorted_items.some((i) => typeof i.sort_order !== 'number');
		if (has_dup || has_bad) await normalize_sort_orders();

		const arr = [...list.items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
		const ci = arr.findIndex((i) => i.id === item.id);
		const ti = ci + direction;
		if (ti >= 0 && ti < arr.length) {
			const target = arr[ti];
			const tmp = item.sort_order;
			item.sort_order = target.sort_order;
			target.sort_order = tmp;
			Promise.all([
				pocketbase.collection('posts').update(item.id, { sort_order: item.sort_order }),
				pocketbase.collection('posts').update(target.id, { sort_order: target.sort_order })
			]);
		}
	}

	// ─── DRAG ────────────────────────────────────────────────────────────────────
	function on_item_pointerdown(e: PointerEvent, item: RecordModel) {
		// Let button sub-elements handle their own events
		if (
			(e.target as HTMLElement) !== e.currentTarget &&
			(e.target as HTMLElement).closest('button')
		)
			return;

		ptr_down_x = e.clientX;
		ptr_down_y = e.clientY;
		ptr_delta = 0;

		// Only drag if already selected
		if (selected_item?.id !== item.id) return;

		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		push_history();
		dragging_item = item;
		drag_rect =
			(e.currentTarget as HTMLElement).closest('.canvas-item-wrapper')?.getBoundingClientRect() ??
			null;
	}

	function on_item_pointermove(e: PointerEvent) {
		ptr_delta = Math.max(ptr_delta, Math.hypot(e.clientX - ptr_down_x, e.clientY - ptr_down_y));
		if (!dragging_item || !drag_rect) return;
		dragging_item.left = (dragging_item.left || 0) + (e.movementX / drag_rect.width) * 100;
		dragging_item.top = (dragging_item.top || 0) + (e.movementY / drag_rect.height) * 100;
	}

	async function on_item_pointerup(e: PointerEvent, item: RecordModel) {
		if (ptr_delta < DRAG_THRESHOLD) select_item(item); // click → select

		if (dragging_item) {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			const it = dragging_item;
			dragging_item = null;
			drag_rect = null;
			await pocketbase.collection('posts').update(it.id, { left: it.left, top: it.top });
		}
	}

	// ─── RESIZE ──────────────────────────────────────────────────────────────────
	function start_resize(e: PointerEvent, item: RecordModel) {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		push_history();
		resizing_item = item;
	}
	function on_resize(e: PointerEvent) {
		if (!resizing_item || !canvas_ref) return;
		const dx = (e.movementX / canvas_ref.getBoundingClientRect().width) * 100;
		resizing_item.width = Math.min(100, Math.max(5, (resizing_item.width || 20) + dx));
	}
	async function stop_resize(e: PointerEvent) {
		if (resizing_item) {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			const it = resizing_item;
			resizing_item = null;
			await pocketbase.collection('posts').update(it.id, { width: it.width });
		}
	}

	// ─── MARGINS ─────────────────────────────────────────────────────────────────
	function start_margin_top(e: PointerEvent, item: RecordModel) {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		push_history();
		margin_top_item = item;
	}
	function start_margin_bottom(e: PointerEvent, item: RecordModel) {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		push_history();
		margin_bottom_item = item;
	}
	function on_margin(e: PointerEvent) {
		if (!canvas_ref) return;
		const dy = (e.movementY / canvas_ref.getBoundingClientRect().width) * 100;
		if (margin_top_item) margin_top_item.margin_top = (margin_top_item.margin_top || 0) + dy;
		else if (margin_bottom_item)
			margin_bottom_item.margin_bottom = (margin_bottom_item.margin_bottom || 0) + dy;
	}
	async function stop_margin(e: PointerEvent) {
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		if (margin_top_item) {
			const it = margin_top_item;
			margin_top_item = null;
			await pocketbase.collection('posts').update(it.id, { margin_top: it.margin_top });
		}
		if (margin_bottom_item) {
			const it = margin_bottom_item;
			margin_bottom_item = null;
			await pocketbase.collection('posts').update(it.id, { margin_bottom: it.margin_bottom });
		}
	}

	// ─── LAYOUT EXPORT ───────────────────────────────────────────────────────────
	async function process_layout() {
		if (!canvas_ref) return;
		const cr = canvas_ref.getBoundingClientRect();
		const scale = 120 / cr.width;
		const oc = new OffscreenCanvas(120, Math.round(cr.height * scale));
		const ctx = oc.getContext('2d')!;
		await Promise.all(
			sorted_items
				.filter((i) => i.file)
				.map(
					(item) =>
						new Promise<void>((res) => {
							const url = pocketbase.files.getURL(item, item.file, { thumb: '600x0' });
							const img = new Image();
							img.crossOrigin = 'anonymous';
							img.onload = () => {
								const el = canvas_ref!.querySelector(
									`[data-id="${item.id}"]`
								) as HTMLElement | null;
								if (!el) return res();
								const r = el.getBoundingClientRect();
								ctx.drawImage(
									img,
									(r.left - cr.left) * scale,
									(r.top - cr.top) * scale,
									r.width * scale,
									r.height * scale
								);
								res();
							};
							img.onerror = () => res();
							img.src = url;
						})
				)
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
		const ok = await confirm('Supprimer cette sélection ?');
		if (!ok) return;
		if (selected_id === post_id) selected_id = null;
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
			onclick: (p: RecordModel | null) => confirm_delete(p?.id || '')
		}
	];
</script>

<svelte:window
	onclick={close_context_menu}
	onscroll={close_context_menu}
	onkeydown={handle_keydown}
/>

<Section size="full">
	<div class="grid w-full grid-cols-5 gap-4">
		<!-- ── LEFT PANEL: thumbnail strip ──────────────────────────────────── -->
		<div class="relative">
			<div class="sticky top-0 h-[90svh] overflow-y-auto">
				<SortableList items={sorted_items} multiple {on_reorder}>
					{#snippet children(item, i)}
						<ListItem
							class={[
								'w-16',
								hovered_item?.id == item.id ? ' bg-accent!' : '',
								'hover:bg-white/10'
							]}
						>
							<div class="" onclick={() => select_from_sidebar(item)}>
								<div class="flex max-w-md min-w-0 flex-1 items-center gap-4">
									<Media
										src="{app.pocketbase.url}/api/files/posts/{item.id}/{item.file}"
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
		<div
			bind:this={canvas_ref}
			class="relative col-span-3 mx-auto mt-8 flex w-xl flex-col items-center border bg-surface"
			onpointerdown={(e) => {
				if (e.target === canvas_ref) deselect();
			}}
		>
			{#each sorted_items as item, i (item.id)}
				{#if item.file}
					{@const is_hov = hovered_item?.id === item.id}
					{@const is_sel = selected_item?.id === item.id}
					{@const is_other_sel = selected_item !== null && !is_sel}

					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="canvas-item-wrapper relative border-2 transition-[border-color] duration-75"
						class:pointer-events-none={is_other_sel}
						class:cursor-default={!is_sel}
						class:cursor-grab={is_sel && !dragging_item}
						class:cursor-grabbing={!!dragging_item && is_sel}
						style:border-color={is_sel
							? 'rgb(59 130 246)'
							: is_hov
								? 'rgba(148,163,184,0.5)'
								: 'transparent'}
						style:transform="translate({item.left || 0}%, {item.top || 0}%)"
						style:width="{item.width || 50}%"
						style:margin-top="{item.margin_top || 0}%"
						style:margin-bottom="{item.margin_bottom || 0}%"
						style:z-index={item.z_index + 50 || 0}
						data-id={item.id}
						onpointerdown={(e) => on_item_pointerdown(e, item)}
						onpointermove={on_item_pointermove}
						onpointerup={(e) => on_item_pointerup(e, item)}
						onpointercancel={(e) => on_item_pointerup(e, item)}
						onmouseenter={() => (hovered_item = item)}
						onmouseleave={() => (hovered_item = null)}
						oncontextmenu={(e) => open_context_menu(e, item)}
					>
						<div style:aspect-ratio={item.aspect_ratio} style:width="100%" class="relative">
							{#if is_sel}
								<!-- Margin top handle -->
								<button
									class="absolute -top-3 left-1/2 z-50 h-4 w-14 -translate-x-1/2 cursor-ns-resize rounded-full bg-blue-500 shadow-md transition-all hover:scale-110 hover:bg-blue-400 active:bg-blue-300"
									onpointerdown={(e) => start_margin_top(e, item)}
									onpointermove={on_margin}
									onpointerup={stop_margin}
									onpointercancel={stop_margin}
									title="Marge haute"
								></button>

								<!-- Inline toolbar -->
								<div
									class="absolute -top-10 left-0 z-50 flex cursor-auto gap-0.5 rounded-md bg-background/95 px-1 py-1 shadow-xl ring-1 ring-white/10 backdrop-blur-sm"
									onpointerdown={(e) => e.stopPropagation()}
								>
									<Button
										onclick={() => move_layer(item, -1)}
										disabled={i === 0}
										tooltip="Monter"
										icon="icon-[ri--arrow-up-line]"
									/>
									<Button
										tooltip="Descendre"
										icon="icon-[ri--arrow-down-line]"
										onclick={() => move_layer(item, 1)}
										disabled={i === sorted_items.length - 1}
									/>
									<div class="bg-surface-300 mx-0.5 w-px self-stretch"></div>
									<Button
										tooltip="Éditer"
										icon="icon-[ri--pencil-fill]"
										onclick={() => editor.open({ method: 'update', record: item })}
									/>
									<Button
										tooltip="Supprimer"
										icon="icon-[ri--delete-bin-line]"
										onclick={() => confirm_delete(item.id)}
									/>
								</div>

								<!-- Margin bottom handle -->
								<button
									class="absolute -bottom-3 left-1/2 z-50 h-4 w-14 -translate-x-1/2 cursor-ns-resize rounded-full bg-blue-500 shadow-md transition-all hover:scale-110 hover:bg-blue-400 active:bg-blue-300"
									onpointerdown={(e) => start_margin_bottom(e, item)}
									onpointermove={on_margin}
									onpointerup={stop_margin}
									onpointercancel={stop_margin}
									title="Marge basse"
								></button>

								<!-- Resize handle -->
								<button
									class="absolute -right-2 -bottom-2 z-50 size-3.5 cursor-nwse-resize rounded-full bg-blue-500 shadow-md transition-all hover:scale-125 hover:bg-blue-400"
									onpointerdown={(e) => start_resize(e, item)}
									onpointermove={on_resize}
									onpointerup={stop_resize}
									onpointercancel={stop_resize}
									title="Redimensionner"
								></button>

								<!-- Corner tick marks (Figma-style) -->
								<span
									class="pointer-events-none absolute -top-0.5 -left-0.5 block size-2.5 border-t-2 border-l-2 border-blue-400"
								></span>
								<span
									class="pointer-events-none absolute -top-0.5 -right-0.5 block size-2.5 border-t-2 border-r-2 border-blue-400"
								></span>
								<span
									class="pointer-events-none absolute -bottom-0.5 -left-0.5 block size-2.5 border-b-2 border-l-2 border-blue-400"
								></span>
								<span
									class="pointer-events-none absolute -right-0.5 -bottom-0.5 block size-2.5 border-r-2 border-b-2 border-blue-400"
								></span>
							{/if}

							{#if file_is_audio(item.file) && item.audio_meta}
								<AudioWaveform meta={item.audio_meta} />
							{:else}
								<ImageComponent
									record_id={item.id}
									filename={item.file}
									collection="posts"
									size="600x0"
									class="pointer-events-none transition-opacity duration-100 select-none {is_other_sel
										? 'opacity-40'
										: ''}"
								/>
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- ── RIGHT PANEL ───────────────────────────────────────────────────── -->
		<div>
			<div class="flex flex-col items-end gap-2">
				<Button onclick={() => editor.open({ method: 'create' })}>+ Nouveau</Button>
				<Button onclick={process_layout}>Traiter le layout</Button>
				<div class="mt-2 flex gap-1">
					<Button
						onclick={undo}
						disabled={!can_undo}
						tooltip="Annuler (Ctrl+Z)"
						icon="icon-[ri--arrow-go-back-line]"
					/>
					<Button
						onclick={redo}
						disabled={!can_redo}
						tooltip="Rétablir (Ctrl+Y)"
						icon="icon-[ri--arrow-go-forward-line]"
					/>
				</div>

				<!-- Live position readout when an item is selected -->
				{#if selected_item}
					<LivePosition active={selected_item} />
				{/if}
			</div>
		</div>
	</div>
</Section>

<!-- Context menu -->
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
