import { getContext, setContext } from 'svelte';

const LIFE_DURATION = 4000;
const DEBUGGING = false;

export type ToastType = 'loading' | 'info' | 'success' | 'warning' | 'error';

export type Toast = {
	id: string;
	type: ToastType;
	title: string;
	body?: string;
	created: string;
};

export class Toaster {
	toasts: Toast[] = $state([]);
	private timers = new Map<string, number>();

	private readonly default_title: Record<ToastType, string> = {
		loading: '...Chargement en cours',
		info: 'Information',
		success: 'Succès',
		warning: 'Attention',
		error: 'Une erreur est survenue'
	};

	constructor() {
		if (DEBUGGING) {
			this.push('loading', 'Chargement');
			this.push('info', 'Information');
			this.push('success', 'Youpi!');
			this.push('warning', 'Ceci est un avertissement');
			this.push('error', 'Erreur lors de greger');
		}
	}

	push(type: ToastType, title?: string, body?: string): string {
		const id = crypto.randomUUID();
		const created = new Date().toISOString();

		if (!title) title = this.default_title[type];

		const toast: Toast = {
			id,
			type,
			title,
			body,
			created
		};

		this.toasts.push(toast);
		if (type !== 'loading') this.scheduleDelete(id);
		return id;
	}

	update(id: string, type: ToastType, title?: string, body?: string): void {
		const index = this.toasts.findIndex((t) => t.id === id);
		if (index === -1) return;

		if (!title) title = this.default_title[type];

		const current = this.toasts[index] as Toast;
		const created = new Date().toISOString();

		this.toasts[index] = {
			...current,
			type,
			title,
			body,
			created
		};

		if (type !== 'loading') this.scheduleDelete(id);
	}

	delete(id: string): void {
		const index = this.toasts.findIndex((t) => t.id === id);
		if (index !== -1) {
			this.toasts.splice(index, 1);
		}
		this.clearScheduleDelete(id);
	}

	private scheduleDelete(id: string): void {
		if (DEBUGGING) return;

		const existing = this.timers.get(id);
		if (existing) {
			clearTimeout(existing);
		}

		const timer = window.setTimeout(() => {
			this.delete(id);
			this.timers.delete(id);
		}, LIFE_DURATION);

		this.timers.set(id, timer);
	}

	private clearScheduleDelete(id: string): void {
		if (this.timers.has(id)) {
			clearTimeout(this.timers.get(id));
			this.timers.delete(id);
		}
	}
}

const TOASTER_KEY = Symbol('TOASTER');
export function init_toaster(): Toaster {
	const manager = new Toaster();
	setContext(TOASTER_KEY, manager);
	return manager;
}

export function use_toaster(): Toaster {
	return getContext<Toaster>(TOASTER_KEY);
}
