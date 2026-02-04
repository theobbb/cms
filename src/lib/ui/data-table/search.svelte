<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { url_query_param } from '$lib/utils/url';
	import Button from '../button.svelte';
	import Input from '../form/input.svelte';

	const {
		id,
		query_param = 'search',
		client_override
	}: {
		id: string;
		query_param?: string;
		client_override?: { on_search: (value: string) => void; on_reset: () => void };
	} = $props();

	let value: string = $state(page.url.searchParams.get(query_param) || '');

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
	<Input
		id="search-{id}"
		class={['bg-background-2 peer', value ? 'w-full pr-54' : 'w-64 focus:w-full']}
		name="search"
		placeholder="Rechercher"
		bind:value
	/>
	<div
		class={[
			value ? '' : 'invisible group-focus-within:visible',
			'pointer-events-none absolute inset-0 flex items-center justify-end gap-1.5 px-1.5 '
		]}
	>
		<div class="pointer-events-auto"><Button type="submit">Rechercher</Button></div>
		<div class="pointer-events-auto">
			<Button variant="ghost" onclick={reset}>Réinitialiser</Button>
		</div>
	</div>
</form>
