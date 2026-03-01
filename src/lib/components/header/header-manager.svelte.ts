import { getContext, setContext, type Snippet } from 'svelte';

type Link = {
	name: string;

	icon: string;
} & ({ href: string } | { snippet: Snippet });

export class HeaderManager {
	links: (Link | undefined)[] = $state([]);

	set_link(index: number, link: Link) {
		this.links[index] = link;
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
