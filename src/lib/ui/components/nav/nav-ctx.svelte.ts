import { getContext, setContext } from 'svelte';

export class NavContext {
	// Treat param as a function that returns a string.
	// This allows it to dynamically peek at the parent's prop!
	getParam: () => string | null;
	parent: NavContext | null;
	expanded = $state(true);

	constructor(getParam: () => string | null, parent: NavContext | null = null) {
		this.getParam = getParam;
		this.parent = parent;
	}

	// This remains perfectly reactive because it invokes the getter function
	get param(): string | null {
		return this.getParam();
	}

	get fullPath(): string {
		const segments: string[] = [];
		let current: NavContext | null = this;

		while (current) {
			if (current.param) {
				segments.unshift(current.param);
			}
			current = current.parent;
		}

		return '/' + segments.join('/');
	}
}

const NAV_KEY = Symbol('NAV_KEY');

export function init_nav(getParam: () => string | null): NavContext {
	// Normal context setup. Runs EXACTLY ONCE per component instance.
	const parent = getContext<NavContext | null>(NAV_KEY) || null;
	const nav = new NavContext(getParam, parent);
	setContext(NAV_KEY, nav);
	return nav;
}

export function use_nav(): NavContext {
	return getContext<NavContext>(NAV_KEY);
}
