<script lang="ts">
	import { use_toaster } from '$lib/logic/toaster.svelte';

	import type { Social } from '$lib/types';
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import OrderList from '$lib/ui/form/order-list.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';

	let { socials = $bindable() }: { socials: Social[] } = $props();

	const toaster = use_toaster();

	let pop_open = $state(false);
	function close_pop() {
		pop_open = false;
	}

	let name: string = $state('');

	const suggestions = [
		'Site web',
		'Portfolio',
		'Instagram',
		'Behance',
		'Dribble',
		'Youtube',
		'LinkedIn'
	];

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form_data = new FormData(event.currentTarget, event.submitter);
		const name = String(form_data.get('name'));
		const url = String(form_data.get('url'));
		if (!name || !url) return toaster.push('error');
		socials.push({ name, url });

		close_pop();
		toaster.push('success', 'Lien ajouté');
	}

	function on_remove_item(item: Social) {
		socials = socials.filter((i) => i != item);
	}
</script>

<div class="">
	<OrderList
		items={socials}
		add_item_text="Ajouter un lien"
		label="liens"
		on_add_item={() => (pop_open = true)}
		{on_remove_item}
	>
		{#snippet item_renderer(social: Social)}
			<div>{social.name}</div>
			<div>{social.url}</div>
		{/snippet}
	</OrderList>
</div>

{#if pop_open}
	<Dialog onclose={close_pop} size="sm">
		<form class="w-sm space-y-gap-y" {onsubmit}>
			<div class="border-b pb-gap-y text-lg">Nouveau lien</div>

			<div class="flex flex-wrap gap-1.5 text-xs whitespace-nowrap">
				{#each suggestions as suggestion}
					<button
						type="button"
						class="cursor-pointer rounded-full bg-black/10 px-1.5 py-px"
						onclick={() => (name = suggestion)}>{suggestion}</button
					>
				{/each}
			</div>
			<Input label="nom du lien" name="name" required bind:value={name} />
			<Input
				label="url"
				name="url"
				required
				type="url"
				value="https://svelte.dev/docs/kit/form-actions#Progressive-enhancement"
			/>
			<div class="flex justify-end gap-1.5">
				<Button variant="ghost" type="reset" size="lg" onclick={close_pop}>Annuler</Button>
				<Button variant="action" type="submit" size="lg">Ajouter</Button>
			</div>
		</form>
	</Dialog>
{/if}
