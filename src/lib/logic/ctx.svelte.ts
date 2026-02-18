import type { App } from '$config/apps';
import type { CollectionModel } from 'pocketbase';
import { createContext } from 'svelte';

export const [get_app, set_app] = createContext<App>();
//export const push_route_param

export const [get_collection, set_collection] = createContext<CollectionModel>();
