import { getContext, setContext } from 'svelte';

export class Pop<T = any> {
	open = $state(false);
	ctx: T = $state({} as T);

	toggle = () => (this.open = !this.open);
	show = (ctx?: T) => {
		this.open = true;
		if (ctx) this.ctx = ctx;
	};
	close = () => (this.open = false);
}

const POP_KEY = Symbol('POP_KEY');

export function set_pop_context(get_pop: () => Pop | null): Pop | null {
	const pop = setContext(POP_KEY, get_pop());
	return pop;
}
export function get_pop_context(): Pop | null {
	const pop = getContext<Pop | null>(POP_KEY) || null;
	return pop;
}
