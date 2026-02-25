<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/ui/button.svelte';
	import { url_query_param } from '$lib/utils/url';

	let {
		url_param = undefined,
		placeholder = 'Rechercher',
		on_search: outer_on_search, // Triggered on Submit (Enter/Button) -> Immediate
		on_reset: outer_on_reset // Triggered on Reset -> Immediate
	}: {
		url_param?: string;
		placeholder?: string;
		on_search?: (v: string) => void;
		on_reset?: () => void;
	} = $props();

	const id = $props.id();

	const url_value = $derived(url_param ? page.url.searchParams.get(url_param) || '' : '');

	let value = $state(url_param ? url_value : '');
	let last_value = $state(value);

	let timer: ReturnType<typeof setTimeout>;

	// Sync: Prop -> Input (Client Mode)
	// $effect(() => {
	// 	if (!is_url_mode && outer_value !== undefined && outer_value !== value) {
	// 		value = outer_value;
	// 	}
	// });
	const has_changed = $derived(url_param ? url_value !== value : last_value != value);

	function on_submit() {
		if (url_param) {
			const url = url_query_param(page.url.href, url_param, value);
			goto(url);
		} else {
			outer_on_search?.(value);
		}
		last_value = value;
	}

	function on_reset() {
		value = '';

		if (url_param) {
			on_submit();
		} else {
			outer_on_reset?.();
			outer_on_search?.('');
		}
	}
</script>

<form
	class="group relative w-full"
	onsubmit={(e) => {
		e.preventDefault();
		on_submit();
	}}
	autocomplete="off"
>
	<label for="search-{id}" class="sr-only">{placeholder}</label>

	<input
		class={[
			'peer',
			'text-surface-foreground placeholder-surface-foreground/50 ring-accent w-full border px-2.5 py-1.5 outline-none focus:ring-2',
			value
				? 'bg-surface w-full pr-24'
				: 'group-hover:bg-surface focus:bg-surface w-64 border-transparent bg-transparent group-hover:border-inherit focus:w-full focus:border-inherit'
		]}
		id="search-{id}"
		name="search"
		{placeholder}
		bind:value
	/>

	<div
		class={[
			value ? 'visible' : 'invisible group-focus-within:visible group-hover:visible',
			'pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end gap-1 px-1.5'
		]}
	>
		<div class="pointer-events-auto">
			<Button type="submit" disabled={!has_changed}>Rechercher</Button>
		</div>

		<div class="pointer-events-auto">
			<Button
				variant="discrete"
				icon="icon-[ri--reset-right-line]"
				disabled={!value}
				onclick={on_reset}
			/>
		</div>
	</div>
</form>
