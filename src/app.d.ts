import PocketBase from 'pocketbase';
import type { App as AppConfig } from './config/apps';
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			app: AppConfig;
			pocketbase: PocketBase;
			super_pocketbase: PocketBase;
			user: any;
			public_route: boolean;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
