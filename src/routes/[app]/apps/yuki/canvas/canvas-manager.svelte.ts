import { get_app } from '$lib/logic/ctx.svelte.js';
import { confirm } from '$lib/logic/confirm.svelte.js';
import type { CollectionModel, RecordModel } from 'pocketbase';
import { use_pocketbase } from '$lib/pocketbase';
import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
import { EditorCollectionList } from '$lib/ui/data-table/collection-list.svelte';
import { Editor, init_editor, use_editor } from '$lib/ui/editor/editor-context.svelte';

type HistorySnapshot = {
	id: string;
	left: number;
	top: number;
	width: number;
	margin_top: number;
	margin_bottom: number;
	z_index: number;
	sort_order: number;
	rotate: number;
}[];

const TRACKED_FIELDS = [
	'left',
	'top',
	'width',
	'margin_top',
	'margin_bottom',
	'z_index',
	'sort_order',
	'rotate'
] as const;

const MAX_HISTORY = 30;

export class CanvasManager {
	collection: CollectionModel;
	list: EditorCollectionList;
	app = get_app();
	editor: Editor;

	absolute: boolean = false;

	pocketbase = use_pocketbase();
	toaster = use_toaster();

	// Canvas & Dom Refs
	canvas_ref: HTMLElement | undefined = $state();
	drag_rect: DOMRect | null = $state(null);

	// History State
	history_stack: HistorySnapshot[] = $state([]);
	history_index = $state(-1);

	// Selection State
	hovered_item: RecordModel | null = $state(null);
	selected_id: string | null = $state(null);

	// Interaction State
	dragging_item: RecordModel | null = $state(null);
	resizing_item: RecordModel | null = $state(null);
	margin_top_item: RecordModel | null = $state(null);
	margin_bottom_item: RecordModel | null = $state(null);
	rotating_item: RecordModel | null = $state(null);

	// Math & Coordinates
	rotate_center: { x: number; y: number } | null = null;
	rotate_start_angle = 0;
	rotate_start_value = 0;
	ptr_down_x = 0;
	ptr_down_y = 0;
	ptr_delta = 0;
	readonly DRAG_THRESHOLD = 5;

	// Menus
	context_menu = $state({ show: false, x: 0, y: 0, item: null as RecordModel | null });

	constructor(collection: CollectionModel, options?: { absolute?: boolean }) {
		this.collection = collection;
		this.list = new EditorCollectionList(collection, { sort: '-sort_order' });
		this.editor = init_editor(collection);
		if (options?.absolute) this.absolute = options.absolute;
		// Auto-initialize history when items load
		$effect(() => {
			if (this.list.items.length > 0 && this.history_stack.length === 0) {
				this.history_stack = [this.snapshot_items()];
				this.history_index = 0;
			}
		});
	}

	// --- DERIVED ---
	can_undo = $derived(this.history_index > 0);
	can_redo = $derived(this.history_index < this.history_stack.length - 1);
	selected_item = $derived(
		this.selected_id != null
			? (this.list.items.find((i: any) => i.id === this.selected_id) ?? null)
			: null
	);
	sorted_items = $derived(
		[...this.list.items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
	);

	// --- HISTORY ---
	snapshot_items = (): HistorySnapshot => {
		return this.list.items.map((item: any) => ({
			id: item.id,
			left: item.left ?? 0,
			top: item.top ?? 0,
			width: item.width ?? 50,
			margin_top: item.margin_top ?? 0,
			margin_bottom: item.margin_bottom ?? 0,
			z_index: item.z_index ?? 0,
			sort_order: item.sort_order ?? 0,
			rotate: item.rotate ?? 0
		}));
	};

	push_history = () => {
		if (this.history_index < this.history_stack.length - 1) {
			this.history_stack = this.history_stack.slice(0, this.history_index + 1);
		}
		this.history_stack = [...this.history_stack, this.snapshot_items()];
		if (this.history_stack.length > MAX_HISTORY) {
			this.history_stack = this.history_stack.slice(this.history_stack.length - MAX_HISTORY);
		}
		this.history_index = this.history_stack.length - 1;
	};

	apply_snapshot = async (snap: HistorySnapshot) => {
		const updates: Promise<unknown>[] = [];
		for (const saved of snap) {
			const item = this.list.items.find((i: any) => i.id === saved.id);
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
					this.pocketbase
						.collection(this.collection.name)
						.update(saved.id, payload, { requestKey: null })
				);
			}
		}
		await Promise.all(updates);
	};

	undo = async () => {
		if (!this.can_undo) return;
		this.history_index -= 1;
		await this.apply_snapshot(this.history_stack[this.history_index]);
		this.toaster.push('success', 'Annulé');
	};

	redo = async () => {
		if (!this.can_redo) return;
		this.history_index += 1;
		await this.apply_snapshot(this.history_stack[this.history_index]);
		this.toaster.push('success', 'Rétabli');
	};

	handle_keydown = (e: KeyboardEvent) => {
		const tag = (e.target as HTMLElement).tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable)
			return;

		if (e.key === 'Escape') {
			this.selected_id = null;
			return;
		}

		const ctrl = e.ctrlKey || e.metaKey;
		if (!ctrl) return;
		if (e.key === 'z' && !e.shiftKey) {
			e.preventDefault();
			this.undo();
		} else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
			e.preventDefault();
			this.redo();
		}
	};

	handle_global_pointerdown = (e: PointerEvent) => {
		if (!this.selected_id) return;

		const target = e.target as HTMLElement | null;
		if (!target) return;

		// Ignore clicks on canvas items (they handle their own selection)
		// Ignore clicks on buttons/links/menus (so we can interact with selected items)
		// Ignore clicks on the left sidebar (.sticky) so we don't flash the selection state
		const is_interactive_ui = target.closest(
			'.canvas-item-wrapper, button, a, [role="button"], .sticky, .fixed.z-9999'
		);

		if (!is_interactive_ui) {
			this.deselect();
		}
	};

	// --- SELECTION & MENUS ---
	select_item = (item: RecordModel) => {
		this.selected_id = item.id;
	};
	deselect = () => {
		this.selected_id = null;
	};

	select_from_sidebar = (item: RecordModel) => {
		this.selected_id = item.id;
		const el = this.canvas_ref?.querySelector(`[data-id="${item.id}"]`) as HTMLElement | null;
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	open_context_menu = (e: MouseEvent, item: RecordModel) => {
		e.preventDefault();
		e.stopPropagation();
		this.context_menu = { show: true, x: e.clientX, y: e.clientY, item };
	};

	close_context_menu = () => {
		this.context_menu.show = false;
	};

	// --- Z-INDEX & SORTING ---
	change_z_index = async (action: 'forward' | 'backward' | 'front' | 'back') => {
		const item = this.context_menu.item;
		if (!item) return;
		this.push_history();
		let new_z = item.z_index || 0;
		if (action === 'forward') new_z += 1;
		else if (action === 'backward') new_z -= 1;
		else if (action === 'front')
			new_z = Math.max(...this.sorted_items.map((i) => i.z_index || 0)) + 1;
		else if (action === 'back')
			new_z = Math.min(...this.sorted_items.map((i) => i.z_index || 0)) - 1;
		item.z_index = new_z;
		this.close_context_menu();
		await this.pocketbase.collection(this.collection.name).update(item.id, { z_index: new_z });
	};

	on_reorder = async (new_order: RecordModel[]) => {
		this.push_history();
		await Promise.all(
			new_order.map((item, i) => {
				const s = (i + 1) * 10;
				item.sort_order = s;
				return this.pocketbase
					.collection(this.collection.name)
					.update(item.id, { sort_order: s }, { requestKey: null });
			})
		);
	};

	normalize_sort_orders = async () => {
		const updates = this.sorted_items.flatMap((item, i) => {
			const s = (i + 1) * 10;
			if (item.sort_order === s) return [];
			item.sort_order = s;
			return [
				this.pocketbase
					.collection(this.collection.name)
					.update(item.id, { sort_order: s }, { requestKey: null })
			];
		});
		if (updates.length) await Promise.all(updates);
	};

	move_layer = async (item: RecordModel, direction: -1 | 1) => {
		this.push_history();
		const has_dup =
			new Set(this.sorted_items.map((i) => i.sort_order)).size !== this.sorted_items.length;
		const has_bad = this.sorted_items.some((i) => typeof i.sort_order !== 'number');
		if (has_dup || has_bad) await this.normalize_sort_orders();

		const arr = [...this.list.items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
		const ci = arr.findIndex((i) => i.id === item.id);
		const ti = ci + direction;
		if (ti >= 0 && ti < arr.length) {
			const target = arr[ti];
			const tmp = item.sort_order;
			item.sort_order = target.sort_order;
			target.sort_order = tmp;
			Promise.all([
				this.pocketbase
					.collection(this.collection.name)
					.update(item.id, { sort_order: item.sort_order }),
				this.pocketbase
					.collection(this.collection.name)
					.update(target.id, { sort_order: target.sort_order })
			]);
		}
	};

	confirm_delete = async (post_id: string) => {
		if (!post_id) return;
		const ok = await confirm('Supprimer cette sélection ?');
		if (!ok) return;
		if (this.selected_id === post_id) this.selected_id = null;
		await this.pocketbase.collection(this.collection.name).delete(post_id);
		this.toaster.push('success', 'Post supprimé');
	};

	// --- TRANSFORMATIONS: DRAG ---
	on_item_pointerdown = (e: PointerEvent, item: RecordModel) => {
		if (
			(e.target as HTMLElement) !== e.currentTarget &&
			(e.target as HTMLElement).closest('button')
		)
			return;

		this.ptr_down_x = e.clientX;
		this.ptr_down_y = e.clientY;
		this.ptr_delta = 0;

		if (this.selected_item?.id !== item.id) return;

		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		this.push_history();
		this.dragging_item = item;
		this.drag_rect =
			(e.currentTarget as HTMLElement).closest('.canvas-item-wrapper')?.getBoundingClientRect() ??
			null;
	};

	on_item_pointermove = (e: PointerEvent) => {
		this.ptr_delta = Math.max(
			this.ptr_delta,
			Math.hypot(e.clientX - this.ptr_down_x, e.clientY - this.ptr_down_y)
		);
		if (!this.dragging_item || !this.drag_rect) return;
		this.dragging_item.left =
			(this.dragging_item.left || 0) + (e.movementX / this.drag_rect.width) * 100;
		this.dragging_item.top =
			(this.dragging_item.top || 0) + (e.movementY / this.drag_rect.height) * 100;
	};

	on_item_pointerup = async (e: PointerEvent, item: RecordModel) => {
		if (this.ptr_delta < this.DRAG_THRESHOLD) this.select_item(item);

		if (this.dragging_item) {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			const it = this.dragging_item;
			this.dragging_item = null;
			this.drag_rect = null;
			await this.pocketbase
				.collection(this.collection.name)
				.update(it.id, { left: it.left, top: it.top });
		}
	};

	// --- TRANSFORMATIONS: RESIZE ---
	start_resize = (e: PointerEvent, item: RecordModel) => {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		this.push_history();
		this.resizing_item = item;
	};

	on_resize = (e: PointerEvent) => {
		if (!this.resizing_item || !this.canvas_ref) return;
		const dx = (e.movementX / this.canvas_ref.getBoundingClientRect().width) * 100;
		this.resizing_item.width = Math.min(100, Math.max(5, (this.resizing_item.width || 20) + dx));
	};

	stop_resize = async (e: PointerEvent) => {
		if (this.resizing_item) {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			const it = this.resizing_item;
			this.resizing_item = null;
			await this.pocketbase.collection(this.collection.name).update(it.id, { width: it.width });
		}
	};

	// --- TRANSFORMATIONS: MARGINS ---
	start_margin_top = (e: PointerEvent, item: RecordModel) => {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		this.push_history();
		this.margin_top_item = item;
	};

	start_margin_bottom = (e: PointerEvent, item: RecordModel) => {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		this.push_history();
		this.margin_bottom_item = item;
	};

	on_margin = (e: PointerEvent) => {
		if (!this.canvas_ref) return;
		const dy = (e.movementY / this.canvas_ref.getBoundingClientRect().width) * 100;
		if (this.margin_top_item)
			this.margin_top_item.margin_top = (this.margin_top_item.margin_top || 0) + dy;
		else if (this.margin_bottom_item)
			this.margin_bottom_item.margin_bottom = (this.margin_bottom_item.margin_bottom || 0) + dy;
	};

	stop_margin = async (e: PointerEvent) => {
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		if (this.margin_top_item) {
			const it = this.margin_top_item;
			this.margin_top_item = null;
			await this.pocketbase
				.collection(this.collection.name)
				.update(it.id, { margin_top: it.margin_top });
		}
		if (this.margin_bottom_item) {
			const it = this.margin_bottom_item;
			this.margin_bottom_item = null;
			await this.pocketbase
				.collection(this.collection.name)
				.update(it.id, { margin_bottom: it.margin_bottom });
		}
	};

	// --- TRANSFORMATIONS: ROTATE ---
	start_rotate = (e: PointerEvent, item: RecordModel) => {
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		this.push_history();
		this.rotating_item = item;

		const wrapper = (e.currentTarget as HTMLElement).closest(
			'.canvas-item-wrapper'
		) as HTMLElement | null;
		if (wrapper) {
			const r = wrapper.getBoundingClientRect();
			this.rotate_center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}
		this.rotate_start_angle =
			Math.atan2(
				e.clientY - (this.rotate_center?.y ?? 0),
				e.clientX - (this.rotate_center?.x ?? 0)
			) *
			(180 / Math.PI);
		this.rotate_start_value = Number(item.rotate) || 0;
	};

	on_rotate = (e: PointerEvent) => {
		if (!this.rotating_item || !this.rotate_center) return;
		const angle =
			Math.atan2(e.clientY - this.rotate_center.y, e.clientX - this.rotate_center.x) *
			(180 / Math.PI);
		const delta = angle - this.rotate_start_angle;
		let new_rotate = this.rotate_start_value + delta;
		if (e.shiftKey) new_rotate = Math.round(new_rotate / 15) * 15;
		this.rotating_item.rotate = Number(new_rotate.toFixed(2));
	};

	stop_rotate = async (e: PointerEvent) => {
		if (this.rotating_item) {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			const it = this.rotating_item;
			this.rotating_item = null;
			this.rotate_center = null;
			await this.pocketbase.collection(this.collection.name).update(it.id, { rotate: it.rotate });
		}
	};

	// --- EXPORT LAYOUT (Specific to Instance A, but available here) ---
	process_layout = async () => {
		if (!this.canvas_ref) return;
		const toast_id = this.toaster.push('loading');
		const cr = this.canvas_ref.getBoundingClientRect();
		const scale = 120 / cr.width;
		const oc = new OffscreenCanvas(120, Math.round(cr.height * scale));
		const ctx = oc.getContext('2d')!;

		const loaded = await Promise.all(
			this.sorted_items
				.filter((i) => i.file)
				.map(
					(item) =>
						new Promise<{ item: RecordModel; img: HTMLImageElement | null }>((res) => {
							const url = this.pocketbase.files.getURL(item, item.file, { thumb: '600x0' });
							const img = new Image();
							img.crossOrigin = 'anonymous';
							img.onload = () => res({ item, img });
							img.onerror = () => res({ item, img: null });
							img.src = url;
						})
				)
		);

		for (const { item, img } of loaded) {
			if (!img) continue;
			const el = this.canvas_ref!.querySelector(`[data-id="${item.id}"]`) as HTMLElement | null;
			if (!el) continue;

			const rotate_deg = item.rotate ?? 0;
			const r = el.getBoundingClientRect();
			const cx = (r.left + r.width / 2 - cr.left) * scale;
			const cy = (r.top + r.height / 2 - cr.top) * scale;
			const w = el.offsetWidth * scale;
			const h = el.offsetHeight * scale;

			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate((rotate_deg * Math.PI) / 180);
			ctx.drawImage(img, -w / 2, -h / 2, w, h);
			ctx.restore();
		}

		const blob = await oc.convertToBlob({ type: 'image/webp' });
		const globals = await this.pocketbase.collection('globals').getFirstListItem('');
		if (!globals?.id) {
			this.toaster.update(toast_id, 'error', 'Globals introuvable');
			return;
		}

		const form = new FormData();
		form.append('layout', blob, 'layout.webp');
		await this.pocketbase.collection('globals').update(globals.id, form);
		this.toaster.update(toast_id, 'success', 'Layout enregistré');
	};
}
