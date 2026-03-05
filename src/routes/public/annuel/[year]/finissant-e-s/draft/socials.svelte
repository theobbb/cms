<script lang="ts">
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';

	import type { Social } from '$lib/types';
	import Button from '$lib/ui/components/button.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import OrderList from '$lib/ui/components/form/fields/order-list.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';

	let { socials = $bindable() }: { socials: Social[] } = $props();

	const toaster = use_toaster();

	const pop = new Pop();

	let name: string = $state('');

	const suggestions = ['Site web', 'Portfolio', 'Instagram', 'Behance', 'Dribble', 'Youtube'];

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form_data = new FormData(event.currentTarget, event.submitter);
		const name = String(form_data.get('name'));
		const url = String(form_data.get('url'));
		if (!name || !url) return toaster.push('error');
		socials.push({ name, url });

		pop.close();
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
		on_add_item={pop.show}
		{on_remove_item}
	>
		{#snippet item_renderer(social: Social)}
			<div class="py-1.5">
				<div>{social.name}</div>
				<div class="text-muted">{social.url}</div>
			</div>
		{/snippet}
	</OrderList>
</div>

<Dialog {pop} size="sm">
	<form class="space-y-gap-y" {onsubmit}>
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
		<Input label="url" name="url" required type="url" />
		<div class="flex justify-end gap-1.5">
			<Button variant="ghost" type="reset" size="lg">Annuler</Button>
			<Button variant="action" type="submit" size="lg">Ajouter</Button>
		</div>
	</form>
</Dialog>
