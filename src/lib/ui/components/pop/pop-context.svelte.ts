import { createContext } from 'svelte';

export class Pop<T = any> {
	open = $state(false);
	ctx: T = $state({} as T);

	toggle = () => (this.open = !this.open);
	show = (ctx: T) => {
		this.open = true;
		this.ctx = ctx;
	};
	close = () => (this.open = false);
}

export const [get_pop_context, set_pop_context] = createContext<Pop>();
