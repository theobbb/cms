<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import FooterButtons from '$lib/ui/form/components/footer-buttons.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';
	//import Select from '$lib/ui/pop/select.svelte';
	import { Select } from 'bits-ui';

	const themes = [
		{ value: 'light-monochrome', label: 'Light Monochrome' },
		{ value: 'dark-green', label: 'Dark Green' },
		{ value: 'svelte-orange', label: 'Svelte Orange' },
		{ value: 'punk-pink', label: 'Punk Pink' },
		{ value: 'ocean-blue', label: 'Ocean Blue', disabled: true },
		{ value: 'sunset-orange', label: 'Sunset Orange' },
		{ value: 'sunset-red', label: 'Sunset Red' },
		{ value: 'forest-green', label: 'Forest Green' },
		{ value: 'lavender-purple', label: 'Lavender Purple', disabled: true },
		{ value: 'mustard-yellow', label: 'Mustard Yellow' },
		{ value: 'slate-gray', label: 'Slate Gray' },
		{ value: 'neon-green', label: 'Neon Green' },
		{ value: 'coral-reef', label: 'Coral Reef' },
		{ value: 'midnight-blue', label: 'Midnight Blue' },
		{ value: 'crimson-red', label: 'Crimson Red' },
		{ value: 'mint-green', label: 'Mint Green' },
		{ value: 'pastel-pink', label: 'Pastel Pink' },
		{ value: 'golden-yellow', label: 'Golden Yellow' },
		{ value: 'deep-purple', label: 'Deep Purple' },
		{ value: 'turquoise-blue', label: 'Turquoise Blue' },
		{ value: 'burnt-orange', label: 'Burnt Orange' }
	];

	let value = $state<string>('');
	const selectedLabel = $derived(
		value ? themes.find((theme) => theme.value === value)?.label : 'Select a theme'
	);

	const dialog = new Pop();
</script>

<Button onclick={dialog.show}>Dialog</Button>
{#if dialog.open}
	<Dialog pop={dialog}>
		<div>ss</div>
		<div>
			<FooterButtons action="Action" onclose={dialog.close} />
		</div>
	</Dialog>
{/if}
