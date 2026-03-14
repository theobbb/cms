<script lang="ts">
	import { use_theme, type ThemeValue } from '$lib/logic/theme.svelte';

	const themes = [
		{ name: 'system', icon: 'icon-[ri--macbook-line]' },
		{ name: 'light', icon: 'icon-[ri--sun-line]' },
		{ name: 'dark', icon: 'icon-[ri--moon-line]' }
	];

	const theme = use_theme();

	function change_theme(value: ThemeValue) {
		theme.set(value);
	}
</script>

<div class="max-w-2xl space-y-2x">
	<div>Thème</div>

	<div class="grid grid-cols-3 gap-2x">
		{#each themes as { name, icon }}
			<button
				class={[
					'min-h-12 cursor-pointer border',
					theme.value == name ? 'bg-accent' : 'hover:bg-accent-hover'
				]}
				onclick={() => change_theme(name as ThemeValue)}
			>
				<div class="flex items-center gap-2 px-4">
					<span class={[icon]}></span>
					<div>{name}</div>
				</div>
			</button>
		{/each}
	</div>
</div>
