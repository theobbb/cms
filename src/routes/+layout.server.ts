import type { ThemeValue } from '$lib/logic/theme.svelte';

export function load({ cookies }) {
	const theme = (cookies.get('theme') ?? 'system') as ThemeValue;
	return { theme };
}
