import { createContext } from 'svelte';

export const [get_params, set_params] = createContext<string[]>();
