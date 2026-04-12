import { createContext } from 'svelte';

export class Pop {
	open = $state(false);
	ctx: any = $state({});

	toggle = () => (this.open = !this.open);
	show = (ctx = {}) => {
		this.open = true;
		this.ctx = ctx;
	};
	close = () => (this.open = false);
}

export const [get_pop_context, set_pop_context] = createContext<Pop>();
