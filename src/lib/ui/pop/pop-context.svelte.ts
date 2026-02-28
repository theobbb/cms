import { createContext } from 'svelte';

export class Pop {
	open = $state(false);

	toggle = () => (this.open = !this.open);
	show = () => (this.open = true);
	close = () => (this.open = false);
}

export const [get_pop_context, set_pop_context] = createContext<Pop>();
