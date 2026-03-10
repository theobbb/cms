<script lang="ts">
	import { page } from '$app/state';
	import { use_theme } from './logic/theme.svelte';

	const theme = use_theme();

	function onkeydown(event: KeyboardEvent) {
		// 1. Get the element currently in focus
		const target = event.target as HTMLElement;

		// 2. Check if the user is typing in a text field
		const isTyping =
			target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

		// 3. If they are typing, don't run the dev shortcuts
		if (isTyping) return;

		if (event.key == 'd') {
			console.log($state.snapshot(page.data));
		}
		if (event.key == 't') {
			console.log('toggle theme');
			theme.set(theme.value === 'dark' ? 'light' : 'dark');
		}
	}
</script>

<svelte:window {onkeydown} />
