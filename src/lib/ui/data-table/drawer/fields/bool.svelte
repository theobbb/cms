<script lang="ts">
	import Button from '$lib/ui/button.svelte';

	import type { FieldProps } from '../field.types';

	let { id, name, label, value, onsubmit = $bindable() }: FieldProps<'bool'> = $props();

	let checked = $state(value);

	onsubmit = async (form_data: FormData) => {
		form_data.set(name, String(checked));
	};
</script>

<div class="flex items-center gap-2">
	<input class="hidden" {id} type="checkbox" {name} bind:checked />

	<Button onclick={() => (checked = !checked)} variant="none" icon>
		<span class={['text-3xl', checked ? 'icon-[ri--toggle-fill]' : 'icon-[ri--toggle-line]']}
		></span>
	</Button>

	<label class="select-none" for={id}>{label}</label>
</div>
