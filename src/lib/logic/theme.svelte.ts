import { getContext, onMount, setContext } from 'svelte';
import { browser } from '$app/environment';

export type ThemeValue = 'light' | 'dark' | 'system';

const THEME_KEY = Symbol('theme');

export class Theme {
	value: ThemeValue = $state('system');

	constructor(initial: ThemeValue) {
		this.value = initial;

		onMount(() => {
			this.apply();
			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			mq.addEventListener('change', () => {
				if (this.value === 'system') this.apply();
			});
		});
	}

	apply(value = this.value) {
		if (!browser) return;
		const isDark =
			value === 'dark' ||
			(value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', isDark);
	}

	set(value: ThemeValue) {
		this.value = value;
		document.cookie = `theme=${value};path=/;max-age=31536000;SameSite=Lax`;
		this.apply(value);
	}
}

export function init_theme(initial: ThemeValue): Theme {
	const t = new Theme(initial);
	setContext(THEME_KEY, t);
	return t;
}

export function use_theme(): Theme {
	return getContext<Theme>(THEME_KEY);
}
