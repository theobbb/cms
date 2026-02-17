<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { url_query_param } from '$lib/utils/url';
	import Button from '../button.svelte';
	import Input from './input.svelte';

	const {
		id,
		query_param = 'search',
		client_override
	}: {
		id: string;
		query_param?: string;
		client_override?: { on_search: (value: string) => void; on_reset: () => void };
	} = $props();

	const url_value = $derived(page.url.searchParams.get(query_param) || '');
	let value: string = $state('');

	const has_changed = $derived(url_value !== value);

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		if (client_override) return client_override.on_search(value);
		//event.currentTarget.reset()

		const url = url_query_param(page.url.href, query_param, value);
		goto(url);
	}

	function reset() {
		value = '';

		if (client_override) return client_override.on_reset();

		const url = url_query_param(page.url.href, query_param, null);
		goto(url);
	}
</script>

<form class="group relative w-full" {onsubmit} autocomplete="off">
	<!-- <Input
		id="search-{id}"
		class={['peer', value ? 'w-full pr-54' : 'w-64- focus:w-full']}
		name="search"
		placeholder="Rechercher"
		bind:value
	/> -->

	<input
		class={[
			'peer',
			value
				? 'w-full  bg-surface pr-54'
				: 'w-64- border-transparent group-hover:border-inherit group-hover:bg-surface focus:w-full focus:border-inherit focus:bg-surface',
			'w-full border px-2.5 py-2 text-surface-foreground placeholder-surface-foreground/50 ring-accent outline-none focus:ring-2'
		]}
		id="search-{id}"
		name="search"
		placeholder="Rechercher"
		bind:value
	/>

	<div
		class={[
			value ? '' : 'invisible group-focus-within:visible group-hover:visible',
			'pointer-events-none absolute inset-0 flex items-center justify-end gap-1.5 px-1.5 '
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
				onclick={reset}
			></Button>
		</div>
	</div>
</form>
