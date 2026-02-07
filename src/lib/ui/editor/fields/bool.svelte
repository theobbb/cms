<script lang="ts">
	import type { FieldProps } from '$config/field.types';
	import Button from '$lib/ui/button.svelte';

	let { id, name, value, onsubmit = $bindable() }: FieldProps<'bool'> = $props();

	let checked = $state(value);

	onsubmit = async (form_data: FormData) => {
		form_data.set(name, String(checked));
	};
</script>

<div class="flex items-center gap-2">
	<input class="hidden" {id} type="checkbox" {name} bind:checked />

	<Button onclick={() => (checked = !checked)} variant="none">
		<span class={['text-3xl', checked ? 'icon-[ri--toggle-fill]' : 'icon-[ri--toggle-line]']}
		></span>
	</Button>

	<label class="select-none" for={id}>{name}</label>
</div>
