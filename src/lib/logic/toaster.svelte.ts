import { getContext, setContext } from 'svelte';

const LIFE_DURATION = 4000;
const DEBUGGING = false;

export type ToastType = 'loading' | 'info' | 'success' | 'warning' | 'error';
type CryptoID = `${string}-${string}-${string}-${string}-${string}`;
type Toast = {
	id: CryptoID;
	type: ToastType;
	title: string;
	body?: string;
	created: string;
};

export class ToastManager {
	toasts: Toast[] = $state([]);
	private timers = new Map<CryptoID, number>();

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

	push(type: ToastType, title?: string, body?: string): CryptoID {
		const id = crypto.randomUUID() as CryptoID;
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

	update(id: CryptoID, type: ToastType, title?: string, body?: string): void {
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

	delete(id: CryptoID): void {
		const index = this.toasts.findIndex((t) => t.id === id);
		if (index !== -1) {
			this.toasts.splice(index, 1);
		}
		this.clearScheduleDelete(id);
	}

	private scheduleDelete(id: CryptoID): void {
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

	private clearScheduleDelete(id: CryptoID): void {
		if (this.timers.has(id)) {
			clearTimeout(this.timers.get(id));
			this.timers.delete(id);
		}
	}
}

const TOAST_KEY = Symbol('toast');
export function init_toaster(): ToastManager {
	const manager = new ToastManager();
	setContext(TOAST_KEY, manager);
	return manager;
}

export function use_toaster(): ToastManager {
	return getContext<ToastManager>(TOAST_KEY);
}
