import { goto } from '$app/navigation';
import { page } from '$app/state';
import { use_pocketbase } from '$lib/pocketbase';
import type { CollectionRecords } from '$lib/pocketbase.types';
import { onMount } from 'svelte';

export type Explorer<T> = {
	navigation: T[][];
	params: string[];
	breadcrumbs: T[];
	children_count: Map<string, number>;
	inspecting: T | undefined;
	inspector: InspectorState<T>;
	actions: Actions<T>;
};

export type BaseItem = {
	id: string;
	parent?: string | undefined;
	title: string;
};

type InspectorState<T> =
	| { mode: 'inspect' }
	| { mode: 'edit'; target: T }
	| { mode: 'create'; parent: T | null };

type Actions<T> = {
	inspect: (id: string | undefined | null) => void;
	edit_item: (item: T) => void;
	new_item: (col_i: number) => void;
	new_sub_item: (parent: T) => void;
	save_item: (id: string, data: Partial<T>) => void;
	delete_item: (item: T) => void;
	onsubmit: (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => void;
};

type Realtime = {
	collection: keyof CollectionRecords;
	options?: any;
};

export function create_explorer<T extends BaseItem>(
	initial_items: T[],
	base_href: string,
	realtime?: Realtime[]
): Explorer<T> {
	let items: T[] = $state(initial_items);

	const pocketbase = use_pocketbase();

	const root_items = $derived(items.filter((item) => !item.parent));

	const current_item_id = $derived(page.params.id);

	const breadcrumbs = $derived.by(() => {
		if (!current_item_id) return [];

		const arr = [];
		let current = items.find((t) => t.id === current_item_id);

		// Safety check: prevent infinite loops if circular dependency exists
		let safety = 0;
		while (current && safety < 50) {
			arr.unshift(current); // Add to beginning
			if (!current.parent) break;
			current = items.find((t) => t.id === current?.parent);
			safety++;
		}

		return arr;
	});

	const params = $derived(breadcrumbs.map((item) => item.id));

	const navigation = $derived.by(() => {
		const arr = [root_items];

		breadcrumbs.forEach((item) => {
			const children = items.filter((t) => t.parent === item.id);
			if (!children.length) return;
			arr.push(children);
		});

		return arr;
	});

	const children_count = $derived.by(() => {
		const map = new Map<string, number>();
		for (const t of items) {
			if (!t.parent) continue;
			map.set(t.parent, (map.get(t.parent) || 0) + 1);
		}
		return map;
	});

	const inspecting = $derived(items.find((t) => t.id == page.params.id));
	let inspector = $state<InspectorState<T>>({ mode: 'inspect' });

	function inspect(id: string | undefined | null) {
		inspector = {
			mode: 'inspect'
		};

		if (!id) goto(base_href);
		else goto(base_href + '/' + id);
	}

	function edit_item(item: T) {
		inspector = {
			mode: 'edit',
			target: item
		};
	}

	function new_item(col_i: number) {
		let parent: T | null = null;

		if (col_i > 0) {
			const parent_id = breadcrumbs[col_i - 1]?.id;
			parent = items.find((t) => t.id === parent_id) ?? null;
		}
		inspector = {
			mode: 'create',
			parent
		};
	}
	function new_sub_item(parent: T) {
		inspector = {
			mode: 'create',
			parent
		};
	}

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		const form_data = new FormData(event.currentTarget, event.submitter);
		const data = Object.fromEntries(form_data.entries()) as Partial<T>;

		if (inspector.mode == 'edit') {
			if (!inspecting?.id) return;

			save_item(inspecting.id, data);
			inspect(inspecting.id);
			return;
		}
		if (inspector.mode != 'create') return;

		const created_by = page.data.user?.id;
		const parent = inspector.parent?.id;

		const new_data = {
			...data,
			created_by,
			parent,
			status: 'new'
		};

		const record = await pocketbase.collection('tickets').create(new_data);

		inspect(record.id);
	}

	async function save_item(id: string, data: Partial<T>) {
		const collection = (data as any).collectionName;
		if (!collection) return;
		await pocketbase.collection(collection).update(id, data);
	}

	async function delete_item(item: T) {
		const collection = (item as any).collectionName;
		if (!collection) {
			console.error('item collection not found');
			return;
		}

		const confirmed = await confirm(
			`Veux-tu vraiment cet item ainsi que tous les pauvres enfants qu'il contient? 😓`
		);
		if (!confirmed) return;

		await pocketbase.collection(collection).delete(item.id);
	}

	onMount(() => {
		if (!realtime?.length) return;
		realtime.forEach(({ collection, options }) => {
			pocketbase.collection(collection).subscribe<T>(
				'*',
				function (e) {
					const record = e.record;
					if (e.action == 'create') {
						console.log(record);

						items.push(record);
					} else if (e.action == 'update') {
						items = items.map((t) => (t.id == record.id ? record : t));
					} else if (e.action == 'delete') {
						items = items.filter((t) => t.id != record.id);
					}
				},
				options
			);
		});

		return () => {
			realtime.forEach(({ collection }) => {
				pocketbase.collection(collection).unsubscribe();
			});
		};
	});

	return {
		get navigation() {
			return navigation;
		},
		get params() {
			return params;
		},
		get breadcrumbs() {
			return breadcrumbs;
		},
		get children_count() {
			return children_count;
		},
		get inspecting() {
			return inspecting;
		},
		get inspector() {
			return inspector;
		},

		actions: {
			inspect,
			edit_item,
			new_item,
			new_sub_item,
			save_item,
			delete_item,
			onsubmit
		}
	};
}
