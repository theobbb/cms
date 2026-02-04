import type { App, Collection } from '$config/types';
import { createContext } from 'svelte';

export const [get_app, set_app] = createContext<App>();
//export const push_route_param

export const [get_collection, set_collection] = createContext<Collection<any>>();
