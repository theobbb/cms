import { getContext, setContext } from 'svelte';

type Link = {
	href: string;
};
type Select = {
	options: string[];
	param: string;
};

export type HeaderItem = {
	name: string;
	icon: string;
} & (Link | Select);

export class HeaderManager {
	start_items: HeaderItem[] = $state([]);
	end_items: HeaderItem[] = $state([]);

	push_start(item: HeaderItem) {
		if (this.start_items.find((i) => i.name == item.name)) return;
		this.start_items.push(item);
	}
	push_end(item: HeaderItem) {
		if (this.end_items.find((i) => i.name == item.name)) return;
		this.end_items.push(item);
	}
}

const HEADER_MANAGER_KEY = Symbol('HEADER_MANAGER');
export function init_header(): HeaderManager {
	const manager = new HeaderManager();
	setContext(HEADER_MANAGER_KEY, manager);
	return manager;
}

export function use_header(): HeaderManager {
	return getContext<HeaderManager>(HEADER_MANAGER_KEY);
}
